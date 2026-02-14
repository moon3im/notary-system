<?php

namespace App\Filament\Admin\Resources\Subscriptions\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class SubscriptionForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('office_id')
                    ->required(),
                TextInput::make('plan_type')
                    ->required(),
                TextInput::make('status')
                    ->required()
                    ->default('active'),
                DateTimePicker::make('started_at')
                    ->required(),
                DateTimePicker::make('ended_at'),
                Toggle::make('auto_renew')
                    ->required(),
                TextInput::make('payment_reference'),
            ]);
    }
}
