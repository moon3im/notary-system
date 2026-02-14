<?php

namespace App\Filament\Resources\Offices\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class OfficeForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),
                TextInput::make('address'),
                TextInput::make('phone')
                    ->tel(),
                TextInput::make('subscription_status')
                    ->required()
                    ->default('inactive'),
            ]);
    }
}
