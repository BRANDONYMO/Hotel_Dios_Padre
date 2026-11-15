import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bitacora } from './bitacora.entity';
import { BitacoraService } from './bitacora.service';
import { BitacoraController } from './bitacora.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Bitacora])],
  providers: [BitacoraService],
  controllers: [BitacoraController],
  exports: [BitacoraService], // Se exporta para que otros módulos lo puedan usar
})
export class BitacoraModule {}