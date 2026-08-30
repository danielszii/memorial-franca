import pool from '../config/database'
import { MemberResponseDTO } from '../dtos/member.dto'

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
}