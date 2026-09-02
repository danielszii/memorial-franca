import pool from '../config/database'
import { MemberResponseDTO } from '../dtos/member.dto'
import { AppError } from '../errors/app.error'

export class MemberRepository {
  async findAll(): Promise<MemberResponseDTO[]> {
    const query = `
      SELECT 
        m.id,
        m.nick,
        m.discord,
        m.rank,
        m.role,
        m.avatar,
        m.bio,
        m.joined,
        m.status,
        m.twitch,
        m.youtube,
        m.instagram,
        m.tiktok,
        m.kick,
        m.is_live,
        m.live_url,
        COALESCE(m.respect_count, 0) AS respect_count,
        COALESCE(
          ARRAY_AGG(mv.era_version ORDER BY mv.era_version ASC) FILTER (WHERE mv.era_version IS NOT NULL),
          ARRAY[]::VARCHAR[]
        ) AS versions
      FROM members m
      LEFT JOIN member_versions mv ON m.id = mv.member_id
      GROUP BY m.id
      ORDER BY m.id ASC;
    `
    const { rows } = await pool.query(query)
    return rows
  }

  async findById(id: number): Promise<MemberResponseDTO | null> {
    const query = `
      SELECT 
        m.id,
        m.nick,
        m.discord,
        m.rank,
        m.role,
        m.avatar,
        m.bio,
        m.joined,
        m.status,
        m.twitch,
        m.youtube,
        m.instagram,
        m.tiktok,
        m.kick,
        m.is_live,
        m.live_url,
        COALESCE(m.respect_count, 0) AS respect_count,
        COALESCE(
          ARRAY_AGG(mv.era_version ORDER BY mv.era_version ASC) FILTER (WHERE mv.era_version IS NOT NULL),
          ARRAY[]::VARCHAR[]
        ) AS versions
      FROM members m
      LEFT JOIN member_versions mv ON m.id = mv.member_id
      WHERE m.id = $1
      GROUP BY m.id;
    `
    const { rows } = await pool.query(query, [id])
    return rows[0] || null
  }

  async voteRespect(
    memberId: number,
    userHash: string,
    voteHash: string
  ): Promise<{ newRespectCount: number; remainingVotes: number }> {
    const client = await pool.connect()
    try {
      await client.query('BEGIN')

      // 1. Verifica quantos votos o usuário já realizou hoje (limite de 5 votos)
      const countRes = await client.query<{ count: string }>(
        'SELECT COUNT(*) AS count FROM daily_votes WHERE user_hash = $1;',
        [userHash]
      )
      const currentVotesCount = Number(countRes.rows[0]?.count || 0)

      if (currentVotesCount >= 5) {
        await client.query('ROLLBACK')
        throw new AppError('Você já utilizou seus 5 votos no Francês da Galera hoje! Volte amanhã.', 429)
      }

      // 2. Tenta registrar o voto (vote_hash é único por membro por dia)
      try {
        await client.query(
          'INSERT INTO daily_votes (user_hash, vote_hash, member_id) VALUES ($1, $2, $3);',
          [userHash, voteHash, memberId]
        )
      } catch (err: any) {
        if (err.code === '23505') {
          // Violação de chave única: já votou neste membro hoje
          await client.query('ROLLBACK')
          throw new AppError('Você já votou neste integrante hoje! Escolha outro membro da França.', 429)
        }
        throw err
      }

      // 3. Incrementa o contador de respeito do membro
      const updateResult = await client.query<{ respect_count: number }>(
        `UPDATE members 
         SET respect_count = COALESCE(respect_count, 0) + 1 
         WHERE id = $1 
         RETURNING respect_count;`,
        [memberId]
      )

      if (updateResult.rows.length === 0) {
        await client.query('ROLLBACK')
        throw new AppError(`Membro com ID ${memberId} não encontrado.`, 404)
      }

      await client.query('COMMIT')
      return {
        newRespectCount: updateResult.rows[0].respect_count,
        remainingVotes: Math.max(0, 5 - (currentVotesCount + 1)),
      }
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }
}