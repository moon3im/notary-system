<?php

namespace App\Filament\Admin\Resources;

use App\Filament\Admin\Resources\UserResource\Pages;
use App\Models\User;
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
use Filament\Tables\Columns\BooleanColumn;
use Illuminate\Support\Facades\Hash;

class UserResource extends Resource
{
    protected static ?string $model = User::class;
    protected static ?string $navigationLabel = 'المستخدمون';
    protected static ?string $pluralLabel = 'المستخدمون';
    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-user-group';

    public static function form(Schema $schema): Schema
{
    return $schema
        ->schema([
            Section::make('User Details')
                ->schema([
                    TextInput::make('name')
                        ->label('الاسم')
                        ->required()
                        ->maxLength(255),

                    TextInput::make('email')
                        ->label('البريد الإلكتروني')
                        ->email()
                        ->required()
                        ->unique(ignoreRecord: true),

                    TextInput::make('password')
                        ->label('كلمة المرور') // Arabic for "Password"
                        ->password()
                        ->required(fn ($livewire) => $livewire instanceof \Filament\Resources\Pages\CreateRecord) // required only on create
                        ->minLength(8)
                        ->dehydrateStateUsing(fn ($state) => Hash::make($state)),

                    Toggle::make('is_admin')
                        ->label('مشرف')
                        ->default(false),
                ]),
        ]);
}

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')->label('الاسم')->searchable()->sortable(),
                TextColumn::make('email')->label('البريد الإلكتروني')->searchable(),
                BooleanColumn::make('is_admin')
                    ->label('مسؤول') // "Admin" in Arabic
                    ->trueIcon('heroicon-o-check')
                    ->falseIcon('heroicon-o-x')
                    ->sortable()
            ])
            ->recordActions([
                Action::make('edit')
                    ->url(fn ($record) => route('filament.admin.resources.users.edit', $record))
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
            'index' => Pages\ListUsers::route('/'),
            'create' => Pages\CreateUser::route('/create'),
            'edit' => Pages\EditUser::route('/{record}/edit'),
        ];
    }
}
