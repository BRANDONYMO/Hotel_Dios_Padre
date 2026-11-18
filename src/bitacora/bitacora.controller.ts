import { Controller, Get, Request } from '@nestjs/common';
import { BitacoraService } from './bitacora.service';

@Controller('bitacora')
export class BitacoraController {
  constructor(private readonly bitacoraService: BitacoraService) {}

  @Get()
  async obtenerBitacora(@Request() req: any) {
    // Si tienes un AuthGuard, puedes validar el rol directamente en el decorador.
    // Por ahora, el controlador devuelve el historial y bloquearemos la vista en admin.js
    return this.bitacoraService.obtenerHistorial();
  }
}