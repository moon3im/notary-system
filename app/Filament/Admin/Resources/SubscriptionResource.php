<?php

namespace App\Filament\Admin\Resources;

use App\Filament\Admin\Resources\SubscriptionResource\Pages;
use App\Models\Subscription;
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
use Filament\Forms\Components\Toggle;

class SubscriptionResource extends Resource
{
    protected static ?string $model = Subscription::class;
    protected static ?string $navigationLabel = 'الاشتراكات';
    protected static ?string $pluralLabel = 'الاشتراكات';
    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-credit-card';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Section::make('Subscription Details')
                    ->schema([
                        TextInput::make('name')
                            ->label('اسم الاشتراك')
                            ->required()
                            ->maxLength(255),
                        Select::make('status')
                            ->label('الحالة')
                            ->options([
                                'active' => 'نشط',
                                'inactive' => 'غير نشط',
                                'expired' => 'منتهي',
                            ])
                            ->default('inactive')
                            ->required(),
                        TextInput::make('price')
                            ->label('السعر')
                            ->numeric()
                            ->required(),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')->label('اسم الاشتراك')->searchable()->sortable(),
                TextColumn::make('status')->label('الحالة')->sortable(),
                TextColumn::make('price')->label('السعر')->sortable(),
            ])
            ->recordActions([
                Action::make('edit')
                    ->url(fn ($record) => route('filament.admin.resources.subscriptions.edit', $record))
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
            'index' => Pages\ListSubscriptions::route('/'),
            'create' => Pages\CreateSubscription::route('/create'),
            'edit' => Pages\EditSubscription::route('/{record}/edit'),
        ];
    }
}
