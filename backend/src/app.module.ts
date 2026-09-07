import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { ContactModule } from './contact/contact.module';
import { ContentModule } from './content/content.module';
import { HealthController } from './health.controller';
import { MenuModule } from './menu/menu.module';
import { OrdersModule } from './orders/orders.module';
import { PrismaModule } from './prisma/prisma.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    MenuModule,
    OrdersModule,
    ReviewsModule,
    ContactModule,
    ContentModule,
    AdminModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
