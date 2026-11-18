import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('control_blancos')
export class ControlBlancos {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  articulo: string; 

  @Column({ type: 'int' })
  cantidad: number;

  @Column({ type: 'varchar', length: 100 })
  estado: string; 

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @CreateDateColumn({ type: 'timestamp' })
  fechaRegistro: Date;
}