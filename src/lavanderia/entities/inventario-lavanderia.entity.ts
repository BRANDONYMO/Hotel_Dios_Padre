import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('inventario_lavanderia')
export class InventarioLavanderia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  articulo: string;

  @Column({ type: 'int', default: 1 })
  unidad: number;

  @Column({ type: 'varchar', length: 50 })
  codigo: string;

  @Column({ type: 'varchar', length: 50 })
  estado: string; 

  @Column({ type: 'varchar', length: 150, nullable: true })
  modelo: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  responsable: string;

  @CreateDateColumn({ type: 'timestamp' })
  fecha: Date;
}