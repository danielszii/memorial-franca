import pool from '../config/database'
import { EraResponseDTO, CreateEraDTO } from '../dtos/era.dto'

export class EraRepository {
  async findAll(): Promise<EraResponseDTO[]> {
    const query = `
      SELECT version, server, period, leader, subs, summary, tag, color
      FROM eras
      ORDER BY version ASC;
    `
    const { rows } = await pool.query(query)
    return rows
  }

  async findByVersion(version: string): Promise<EraResponseDTO | null> {
    const query = `
      SELECT version, server, period, leader, subs, summary, tag, color
      FROM eras
      WHERE LOWER(version) = LOWER($1);
    `
    const { rows } = await pool.query(query, [version])
    return rows[0] || null
  }

  async create(data: CreateEraDTO): Promise<void> {
    const query = `
      INSERT INTO eras (version, server, period, leader, subs, summary, tag, color)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
    `
    const values = [
      data.version,
      data.server,
      data.period,
      data.leader,
      data.subs, // arrays no pg são passados diretamente como array do JS
      data.summary,
      data.tag,
      data.color,
    ]

    await pool.query(query, values)
  }
}