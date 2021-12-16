import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Type } from 'class-transformer';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { Payment } from './entites/payment.entity';
import { PaymentResolver } from './payments.resolver';
import { PaymentService } from './payments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Restaurant])],
  providers: [PaymentService, PaymentResolver],
})
export class PaymentsModule {}
