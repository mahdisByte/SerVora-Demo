<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id('booking_id');
            $table->integer('services_id');
            $table->integer('user_id');
            $table->string('booking_time', 100);
            $table->timestamp('created_at')->useCurrent();
            $table->string('status', 100);
            $table->string('payment_status', 100);
            $table->timestamp('updated_at')->useCurrent();
        });
    }

    public function down(): void {
        Schema::dropIfExists('bookings');
    }
};
