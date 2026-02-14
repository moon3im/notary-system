<?php

namespace App\Filament\Admin\Resources\UserResource\Pages;

use App\Filament\Admin\Resources\UserResource;
use Filament\Resources\Pages\ListRecords;
use Filament\Actions\CreateAction;

class ListUsers extends ListRecords
{
    protected static string $resource = UserResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make('create')
                ->label('إضافة مستخدم') // Arabic "Add User"
                ->button()
        ];
    }
}
