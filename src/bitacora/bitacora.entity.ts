import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity'; // Asegúrate de que esta ruta coincida con tu proyecto

@Entity('bitacora')
export class Bitacora {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'usuario_id' })
  usuarioId: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({ type: 'varchar', length: 255 })
  accion: string; // Ej: "Modificación de tarifa", "Cancelación de reserva"

  @Column({ type: 'text', nullable: true })
  detalles: string; // Ej: "Usuario X modificó la tarifa de la reserva RES-123..."

  // CreateDateColumn guarda automáticamente la fecha y hora exacta del servidor
  @CreateDateColumn({ name: 'fecha_hora', type: 'timestamp' })
  fechaHora: Date; 
}