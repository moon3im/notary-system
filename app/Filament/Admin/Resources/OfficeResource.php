<?php

namespace App\Filament\Admin\Resources;

use App\Filament\Admin\Resources\OfficeResource\Pages;
use App\Models\Office;
use Filament\Forms;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Actions\Action;
use Filament\Actions\BulkAction;
use Filament\Actions\BulkActionGroup;
use Filament\Tables\Columns\TextColumn;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;
use Filament\Support\Icons\Heroicon;
use Filament\Forms\Components\Toggle;


class OfficeResource extends Resource
{
    protected static ?string $model = Office::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-building-office';

    protected static ?string $navigationLabel = 'المكاتب';
    
    protected static ?string $pluralLabel = 'المكاتب';

   public static function form(Schema $schema): Schema
{
    return $schema
        ->schema([
            Section::make('Office Details')  // A section title
                ->schema([
                    TextInput::make('name')
                        ->label('اسم المكتب')
                        ->required()
                        ->maxLength(255)
                        ->unique(ignoreRecord: true),

                    TextInput::make('address')
                        ->label('العنوان')
                        ->maxLength(255),

                    TextInput::make('phone')
                        ->label('رقم الهاتف')
                        ->tel()
                        ->maxLength(20),

                    Select::make('subscription_status')
                        ->label('حالة الاشتراك')
                        ->options([
                            'active' => 'نشط',
                            'inactive' => 'غير نشط',
                            'suspended' => 'موقوف',
                        ])
                        ->default('inactive')
                        ->required(),
                ]),
        ]);
}

    public static function table(Table $table): Table
{
    return $table
        ->columns([
            TextColumn::make('name')->label('اسم المكتب')->searchable()->sortable(),
            TextColumn::make('address')->label('العنوان')->searchable(),
            TextColumn::make('phone')->label('رقم الهاتف'),
            TextColumn::make('subscription_status')
                ->label('الحالة')
                ->badge()
                ->color(fn(string $state): string => match ($state) {
                    'active' => 'success',
                    'inactive' => 'danger',
                    'suspended' => 'warning',
                    default => 'gray',
                })
                ->formatStateUsing(fn(string $state): string => match ($state) {
                    'active' => 'نشط',
                    'inactive' => 'غير نشط',
                    'suspended' => 'موقوف',
                    default => $state,
                }),
        ])
        ->recordActions([
            Action::make('edit')
        ->url(fn ($record) => route('filament.admin.resources.offices.edit', $record))
                ->icon('heroicon-o-pencil'),

            Action::make('delete')
                ->requiresConfirmation()
                ->action(fn ($record) => $record->delete())
                ->icon('heroicon-o-trash'),
        ])
        ->bulkActions([
            BulkActionGroup::make([
                BulkAction::make('delete')
                    ->requiresConfirmation()
                    ->action(fn ($records) => $records->each->delete()),
            ]),
        ]);
}

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListOffices::route('/'),
            'create' => Pages\CreateOffice::route('/create'),
            'edit' => Pages\EditOffice::route('/{record}/edit'),
        ];
    }
}