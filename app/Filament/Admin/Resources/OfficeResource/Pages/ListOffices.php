<?php

namespace App\Filament\Admin\Resources\OfficeResource\Pages;

use App\Filament\Admin\Resources\OfficeResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListOffices extends ListRecords
{
    protected static string $resource = OfficeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}