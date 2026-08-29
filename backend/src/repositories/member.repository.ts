import pool from '../config/database'
import { CreateMemberDTO, MemberResponseDTO } from '../dtos/member.dto'

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
    // Parâmetro $1 isola o ID de qualquer injeção
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

  async findByNick(nick: string): Promise<MemberResponseDTO | null> {
    // Parâmetro $1 impede injeções por texto/nick
    const query = `
      SELECT id, nick, discord, rank, role, avatar, bio, joined, status, twitch, youtube, instagram, tiktok, kick, is_live, live_url
      FROM members
      WHERE LOWER(nick) = LOWER($1);
    `
    const { rows } = await pool.query(query, [nick])
    return rows[0] || null
  }

  async create(data: CreateMemberDTO): Promise<number> {
    const client = await pool.connect()

    try {
      await client.query('BEGIN')

      // Inserção parametrizada na tabela principal
      const insertMemberQuery = `
        INSERT INTO members (nick, discord, rank, role, avatar, bio, status, twitch, youtube, instagram, tiktok, kick, is_live, live_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING id;
      `
      const values = [
        data.nick,
        data.discord || null,
        data.rank,
        data.role,
        data.avatar || null,
        data.bio || '',
        data.status || 'Ativo',
        data.twitch || null,
        data.youtube || null,
        data.instagram || null,
        data.tiktok || null,
        data.kick || null,
        data.is_live || false,
        data.live_url || null,
      ]

      const { rows } = await client.query(insertMemberQuery, values)
      const memberId = rows[0].id

      // Inserção parametrizada das versões do membro
      if (data.versions && data.versions.length > 0) {
        for (const version of data.versions) {
          await client.query(
            'INSERT INTO member_versions (member_id, era_version) VALUES ($1, $2);',
            [memberId, version]
          )
        }
      }

      await client.query('COMMIT')
      return memberId
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  async delete(id: number): Promise<boolean> {
    // Parâmetro $1 para exclusão segura
    const query = 'DELETE FROM members WHERE id = $1;'
    const result = await pool.query(query, [id])
    return (result.rowCount ?? 0) > 0
  }
}