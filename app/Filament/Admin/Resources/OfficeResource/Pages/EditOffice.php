<?php

namespace App\Filament\Admin\Resources\OfficeResource\Pages;

use App\Filament\Admin\Resources\OfficeResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditOffice extends EditRecord
{
    protected static string $resource = OfficeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}