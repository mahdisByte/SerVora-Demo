<?php

//to create tables by migrate-> php artisan migrate
//to crete dummy data by seeder-> php artisan db:seed (it does not drop table)

//Or do both in  one step(this is better)-> php artisan migrate:fresh --seed (it drops previous tables,create new table and then insert data)


namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BookingsTableSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //clear the table first
        DB::table('bookings')->truncate();

        //Insert bookings
        DB::table('bookings')->insert([
            ['booking_id'=>1,'services_id'=>19,'user_id'=>43423,'booking_time'=>'4214q2','created_at'=>'2025-08-14 22:43:03','status'=>'qrqwr','payment_status'=>'arr','updated_at'=>'2025-08-14 22:43:03'],
            ['booking_id'=>3,'services_id'=>19,'user_id'=>34345,'booking_time'=>'10-7','created_at'=>'2025-08-14 22:49:20','status'=>'yes','payment_status'=>'no','updated_at'=>'2025-08-14 22:49:20'],
            ['booking_id'=>4,'services_id'=>19,'user_id'=>3453,'booking_time'=>'10-7','created_at'=>'2025-08-15 05:21:09','status'=>'unconfirmed','payment_status'=>'no','updated_at'=>'2025-08-15 05:21:09'],
            ['booking_id'=>5,'services_id'=>19,'user_id'=>3453,'booking_time'=>'10-7','created_at'=>'2025-08-15 05:22:22','status'=>'unconfirmed','payment_status'=>'no','updated_at'=>'2025-08-15 05:22:22'],
            ['booking_id'=>6,'services_id'=>19,'user_id'=>354542,'booking_time'=>'10-7','created_at'=>'2025-08-15 05:23:07','status'=>'yes','payment_status'=>'no','updated_at'=>'2025-08-15 05:23:07'],
            ['booking_id'=>7,'services_id'=>19,'user_id'=>35264,'booking_time'=>'10-7','created_at'=>'2025-08-15 05:37:27','status'=>'yes','payment_status'=>'no','updated_at'=>'2025-08-15 05:37:27'],
            ['booking_id'=>8,'services_id'=>20,'user_id'=>4254,'booking_time'=>'10-7','created_at'=>'2025-08-15 06:39:22','status'=>'unconfirmed','payment_status'=>'no','updated_at'=>'2025-08-15 06:39:22'],
            ['booking_id'=>9,'services_id'=>22,'user_id'=>5666,'booking_time'=>'10-7','created_at'=>'2025-08-15 09:29:29','status'=>'unconfirmed','payment_status'=>'no','updated_at'=>'2025-08-15 09:29:29'],
            ['booking_id'=>10,'services_id'=>31,'user_id'=>142,'booking_time'=>'10-7','created_at'=>'2025-08-15 21:13:42','status'=>'yes','payment_status'=>'no','updated_at'=>'2025-08-15 21:13:42'],
        ]);
    }
}
