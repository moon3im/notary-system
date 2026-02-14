import React, { useCallback, useMemo, useState } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { 
    LexicalTypeaheadMenuPlugin, 
    MenuOption,
    useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { 
    $createTextNode, 
    $getSelection, 
    $isRangeSelection, 
    TextNode,
    $getRoot,
    $createParagraphNode
} from 'lexical';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { LinkNode } from '@lexical/link'; // ✅ استيراد LinkNode
import { ListNode, ListItemNode } from '@lexical/list'; // ✅ استيراد عقد القوائم

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Bold,
    Italic,
    Underline,
    Undo,
    Redo,
    User,
    Calendar,
    Hash,
    FileText,
    DollarSign,
    Home,
    MapPin,
    Phone,
    IdCard,
    Globe,
    Briefcase,
    Heart,
    BookOpen,
    UserCircle,
    Users,
    FileSignature,
    Settings
} from 'lucide-react';

// ============================================
// 1. تعريف خيارات الحقول الديناميكية
// ============================================

export interface PlaceholderOption {
    key: string;
    label: string;
    category: 'seller' | 'buyer' | 'contract' | 'property' | 'system';
    icon: React.ReactNode;
    description?: string;
    example?: string;
}

export const PLACEHOLDER_OPTIONS: PlaceholderOption[] = [
    // ===== البائع =====
    {
        key: 'seller_full_name',
        label: 'اسم البائع الكامل',
        category: 'seller',
        icon: <User className="h-4 w-4 text-blue-600" />,
        description: 'الاسم الأول + اسم الأب + اللقب',
        example: 'محمد بن أحمد بن يطو'
    },
    {
        key: 'seller_first_name',
        label: 'الاسم الأول للبائع',
        category: 'seller',
        icon: <UserCircle className="h-4 w-4 text-blue-500" />,
        description: 'الاسم الأول فقط',
        example: 'محمد'
    },
    {
        key: 'seller_last_name',
        label: 'لقب البائع',
        category: 'seller',
        icon: <UserCircle className="h-4 w-4 text-blue-500" />,
        description: 'اللقب العائلي',
        example: 'بن يطو'
    },
    {
        key: 'seller_father_name',
        label: 'اسم أب البائع',
        category: 'seller',
        icon: <Users className="h-4 w-4 text-blue-500" />,
        description: 'اسم الأب',
        example: 'أحمد'
    },
    {
        key: 'seller_mother_name',
        label: 'اسم أم البائع',
        category: 'seller',
        icon: <Heart className="h-4 w-4 text-pink-500" />,
        description: 'اسم الأم',
        example: 'فاطمة'
    },
    {
        key: 'seller_nationality',
        label: 'جنسية البائع',
        category: 'seller',
        icon: <Globe className="h-4 w-4 text-green-600" />,
        description: 'الجنسية',
        example: 'جزائري'
    },
    {
        key: 'seller_profession',
        label: 'مهنة البائع',
        category: 'seller',
        icon: <Briefcase className="h-4 w-4 text-purple-600" />,
        description: 'المهنة',
        example: 'موظف'
    },
    {
        key: 'seller_birth_date',
        label: 'تاريخ ميلاد البائع',
        category: 'seller',
        icon: <Calendar className="h-4 w-4 text-orange-600" />,
        description: 'تاريخ الميلاد',
        example: '07/01/1988'
    },
    {
        key: 'seller_birth_place',
        label: 'مكان ميلاد البائع',
        category: 'seller',
        icon: <MapPin className="h-4 w-4 text-red-600" />,
        description: 'مكان الميلاد',
        example: 'المسيلة'
    },
    {
        key: 'seller_birth_certificate',
        label: 'رقم شهادة ميلاد البائع',
        category: 'seller',
        icon: <FileText className="h-4 w-4 text-gray-600" />,
        description: 'رقم شهادة الميلاد',
        example: '00129'
    },
    {
        key: 'seller_national_id',
        label: 'رقم بطاقة التعريف للبائع',
        category: 'seller',
        icon: <IdCard className="h-4 w-4 text-indigo-600" />,
        description: 'رقم بطاقة التعريف الوطنية',
        example: '201766707'
    },
    {
        key: 'seller_address',
        label: 'عنوان البائع',
        category: 'seller',
        icon: <Home className="h-4 w-4 text-emerald-600" />,
        description: 'العنوان الكامل',
        example: 'حي النهضة 300 مسكن بالمسيلة'
    },
    {
        key: 'seller_phone',
        label: 'هاتف البائع',
        category: 'seller',
        icon: <Phone className="h-4 w-4 text-cyan-600" />,
        description: 'رقم الهاتف',
        example: '0555123456'
    },

    // ===== المشتري =====
    {
        key: 'buyer_full_name',
        label: 'اسم المشتري الكامل',
        category: 'buyer',
        icon: <User className="h-4 w-4 text-green-600" />,
        description: 'الاسم الأول + اسم الأب + اللقب',
        example: 'فطيمة بنت يوسف بختي'
    },
    {
        key: 'buyer_first_name',
        label: 'الاسم الأول للمشتري',
        category: 'buyer',
        icon: <UserCircle className="h-4 w-4 text-green-500" />,
        description: 'الاسم الأول فقط',
        example: 'فطيمة'
    },
    {
        key: 'buyer_last_name',
        label: 'لقب المشتري',
        category: 'buyer',
        icon: <UserCircle className="h-4 w-4 text-green-500" />,
        description: 'اللقب العائلي',
        example: 'بختي'
    },
    {
        key: 'buyer_father_name',
        label: 'اسم أب المشتري',
        category: 'buyer',
        icon: <Users className="h-4 w-4 text-green-500" />,
        description: 'اسم الأب',
        example: 'يوسف'
    },
    {
        key: 'buyer_mother_name',
        label: 'اسم أم المشتري',
        category: 'buyer',
        icon: <Heart className="h-4 w-4 text-pink-500" />,
        description: 'اسم الأم',
        example: 'عائشة'
    },
    {
        key: 'buyer_nationality',
        label: 'جنسية المشتري',
        category: 'buyer',
        icon: <Globe className="h-4 w-4 text-green-600" />,
        description: 'الجنسية',
        example: 'جزائري'
    },
    {
        key: 'buyer_profession',
        label: 'مهنة المشتري',
        category: 'buyer',
        icon: <Briefcase className="h-4 w-4 text-green-600" />,
        description: 'المهنة',
        example: 'ربة بيت'
    },
    {
        key: 'buyer_birth_date',
        label: 'تاريخ ميلاد المشتري',
        category: 'buyer',
        icon: <Calendar className="h-4 w-4 text-orange-600" />,
        description: 'تاريخ الميلاد',
        example: '11/04/1960'
    },
    {
        key: 'buyer_birth_place',
        label: 'مكان ميلاد المشتري',
        category: 'buyer',
        icon: <MapPin className="h-4 w-4 text-red-600" />,
        description: 'مكان الميلاد',
        example: 'المطارفة'
    },
    {
        key: 'buyer_birth_certificate',
        label: 'رقم شهادة ميلاد المشتري',
        category: 'buyer',
        icon: <FileText className="h-4 w-4 text-gray-600" />,
        description: 'رقم شهادة الميلاد',
        example: '00024'
    },
    {
        key: 'buyer_national_id',
        label: 'رقم بطاقة التعريف للمشتري',
        category: 'buyer',
        icon: <IdCard className="h-4 w-4 text-indigo-600" />,
        description: 'رقم بطاقة التعريف الوطنية',
        example: '200849489'
    },
    {
        key: 'buyer_address',
        label: 'عنوان المشتري',
        category: 'buyer',
        icon: <Home className="h-4 w-4 text-emerald-600" />,
        description: 'العنوان الكامل',
        example: 'حي 322 مسكن بالمسيلة'
    },
    {
        key: 'buyer_phone',
        label: 'هاتف المشتري',
        category: 'buyer',
        icon: <Phone className="h-4 w-4 text-cyan-600" />,
        description: 'رقم الهاتف',
        example: '0555987654'
    },

    // ===== معلومات العقد =====
    {
        key: 'contract_date',
        label: 'تاريخ العقد',
        category: 'contract',
        icon: <Calendar className="h-4 w-4 text-purple-600" />,
        description: 'تاريخ تحرير العقد',
        example: '05/08/2021'
    },
    {
        key: 'contract_number',
        label: 'رقم العقد',
        category: 'contract',
        icon: <Hash className="h-4 w-4 text-purple-600" />,
        description: 'رقم العقد في السجل',
        example: '102/ع ب/21'
    },
    {
        key: 'index_number',
        label: 'رقم الفهرس',
        category: 'contract',
        icon: <BookOpen className="h-4 w-4 text-purple-600" />,
        description: 'رقم الفهرس في السجل',
        example: '102'
    },
    {
        key: 'deposit_number',
        label: 'رقم الإيداع',
        category: 'contract',
        icon: <FileSignature className="h-4 w-4 text-purple-600" />,
        description: 'رقم إيداع العقد',
        example: '248/60'
    },
    {
        key: 'drawing_number',
        label: 'رقم الرسم',
        category: 'contract',
        icon: <FileText className="h-4 w-4 text-purple-600" />,
        description: 'رقم الرسم العقاري',
        example: '143'
    },

    // ===== العقار =====
    {
        key: 'property_number',
        label: 'رقم الملكية',
        category: 'property',
        icon: <Hash className="h-4 w-4 text-orange-600" />,
        description: 'رقم مجموعة الملكية',
        example: '029'
    },
    {
        key: 'section',
        label: 'القسم',
        category: 'property',
        icon: <MapPin className="h-4 w-4 text-orange-600" />,
        description: 'رقم القسم',
        example: '237'
    },
    {
        key: 'plot_number',
        label: 'رقم القطعة',
        category: 'property',
        icon: <MapPin className="h-4 w-4 text-orange-600" />,
        description: 'رقم القطعة الأرضية',
        example: '16/59'
    },
    {
        key: 'area',
        label: 'المساحة',
        category: 'property',
        icon: <FileText className="h-4 w-4 text-orange-600" />,
        description: 'مساحة العقار',
        example: '150.00'
    },
    {
        key: 'location',
        label: 'الموقع',
        category: 'property',
        icon: <MapPin className="h-4 w-4 text-orange-600" />,
        description: 'موقع العقار',
        example: 'سبع الغربي اشبيليا القديمة'
    },
    {
        key: 'price',
        label: 'الثمن',
        category: 'property',
        icon: <DollarSign className="h-4 w-4 text-orange-600" />,
        description: 'ثمن البيع',
        example: '750000.00'
    },
    {
        key: 'paid_amount',
        label: 'المبلغ المدفوع',
        category: 'property',
        icon: <DollarSign className="h-4 w-4 text-green-600" />,
        description: 'المبلغ المدفوع نقداً',
        example: '600000.00'
    },
    {
        key: 'remaining_amount',
        label: 'المبلغ المتبقي',
        category: 'property',
        icon: <DollarSign className="h-4 w-4 text-red-600" />,
        description: 'المبلغ المتبقي',
        example: '150000.00'
    },

    // ===== النظام =====
    {
        key: 'office_name',
        label: 'اسم المكتب',
        category: 'system',
        icon: <Settings className="h-4 w-4 text-gray-600" />,
        description: 'اسم مكتب التوثيق',
        example: 'المسيلة'
    },
    {
        key: 'office_phone',
        label: 'هاتف المكتب',
        category: 'system',
        icon: <Phone className="h-4 w-4 text-gray-600" />,
        description: 'رقم هاتف المكتب',
        example: '0660650013'
    },
    {
        key: 'notary_name',
        label: 'اسم الموثق',
        category: 'system',
        icon: <User className="h-4 w-4 text-gray-600" />,
        description: 'اسم الموثق',
        example: 'عبد الكريم بتغة'
    },
    {
        key: 'notary_address',
        label: 'عنوان الموثق',
        category: 'system',
        icon: <Home className="h-4 w-4 text-gray-600" />,
        description: 'عنوان مكتب الموثق',
        example: 'العقيد عميروش (جنان بوديعة) طريق البرج بالمسيلة'
    },
    {
        key: 'today_date',
        label: 'تاريخ اليوم',
        category: 'system',
        icon: <Calendar className="h-4 w-4 text-gray-600" />,
        description: 'تاريخ اليوم الحالي',
        example: '14/02/2026'
    },
];

// ============================================
// 2. خيارات القائمة المنسدلة
// ============================================

class PlaceholderMenuOption extends MenuOption {
    key: string;
    label: string;
    category: string;
    icon: React.ReactNode;
    description: string;
    example: string;

    constructor(option: PlaceholderOption) {
        super(option.key);
        this.key = option.key;
        this.label = option.label;
        this.category = option.category;
        this.icon = option.icon;
        this.description = option.description || '';
        this.example = option.example || '';
    }
}

// ============================================
// 3. Plugin القائمة المنسدلة
// ============================================

function PlaceholderTypeaheadPlugin() {
    const [editor] = useLexicalComposerContext();
    
    const checkForTriggerMatch = useBasicTypeaheadTriggerMatch('{{', {
        minLength: 0,
    });

    const options = useMemo(() => {
        return PLACEHOLDER_OPTIONS.map(opt => new PlaceholderMenuOption(opt));
    }, []);

    const onSelectOption = useCallback(
        (selectedOption: PlaceholderMenuOption, nodeToRemove: TextNode | null, closeMenu: () => void) => {
            editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    if (nodeToRemove) {
                        nodeToRemove.remove();
                    }
                    selection.insertText(`{{${selectedOption.key}}} `);
                }
                closeMenu();
            });
        },
        [editor]
    );

    return (
        <LexicalTypeaheadMenuPlugin
            onQueryChange={() => {}}
            onSelectOption={onSelectOption}
            triggerFn={checkForTriggerMatch}
            options={options}
            menuRenderFn={(
                anchorElementRef,
                { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }
            ) => {
                return (
                    <div 
                        className="fixed z-50 w-96 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
                        style={{
                            top: anchorElementRef.current?.getBoundingClientRect().bottom || 0,
                            left: anchorElementRef.current?.getBoundingClientRect().left || 0,
                            maxHeight: '400px',
                            overflowY: 'auto'
                        }}
                    >
                        <div className="p-2 border-b bg-gray-50">
                            <span className="text-xs font-medium text-gray-500">اختر حقلاً ديناميكياً</span>
                        </div>

                        <div className="divide-y">
                            {options.map((option, index) => {
                                const isSelected = selectedIndex === index;
                                return (
                                    <button
                                        key={option.key}
                                        className={`w-full text-right px-4 py-3 hover:bg-gray-50 flex items-start gap-3 transition-colors ${
                                            isSelected ? 'bg-blue-50 border-r-4 border-blue-600' : ''
                                        }`}
                                        onClick={() => selectOptionAndCleanUp(option)}
                                        onMouseEnter={() => setHighlightedIndex(index)}
                                    >
                                        <div className="mt-0.5">{option.icon}</div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-gray-900">
                                                    {option.label}
                                                </span>
                                                <span className="text-xs text-gray-400 font-mono">
                                                    {'{{'}{option.key}{'}}'}
                                                </span>
                                            </div>
                                            {option.description && (
                                                <p className="text-xs text-gray-500 mt-0.5 text-right">
                                                    {option.description}
                                                </p>
                                            )}
                                            {option.example && (
                                                <p className="text-xs text-gray-400 mt-1 font-mono bg-gray-50 p-1 rounded">
                                                    مثال: {option.example}
                                                </p>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );
            }}
        />
    );
}

// ============================================
// 4. شريط الأدوات
// ============================================

function ToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);

    const formatText = (format: string) => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                switch (format) {
                    case 'bold':
                        selection.formatText('bold');
                        setIsBold(!isBold);
                        break;
                    case 'italic':
                        selection.formatText('italic');
                        setIsItalic(!isItalic);
                        break;
                    case 'underline':
                        selection.formatText('underline');
                        setIsUnderline(!isUnderline);
                        break;
                }
            }
        });
    };

    const insertPlaceholder = (key: string) => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                selection.insertText(`{{${key}}} `);
            }
        });
    };

    return (
        <div className="border-b p-2 flex flex-wrap gap-1 bg-gray-50 rounded-t-lg sticky top-0 z-10">
            {/* تنسيق النص */}
            <div className="flex gap-1 border-l pl-2 ml-2">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => formatText('bold')}
                    className={isBold ? 'bg-blue-100' : ''}
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => formatText('italic')}
                    className={isItalic ? 'bg-blue-100' : ''}
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => formatText('underline')}
                    className={isUnderline ? 'bg-blue-100' : ''}
                >
                    <Underline className="h-4 w-4" />
                </Button>
            </div>

            {/* History */}
            <div className="flex gap-1 border-l pl-2 ml-2">
                <Button variant="ghost" size="sm" onClick={() => editor.undo()}>
                    <Undo className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => editor.redo()}>
                    <Redo className="h-4 w-4" />
                </Button>
            </div>

            {/* Placeholders - تصنيفات */}
            <div className="flex-1 flex gap-1 flex-wrap">
                <span className="text-xs text-gray-500 flex items-center mx-2">|</span>
                
                {/* حقول البائع */}
                <div className="relative group">
                    <Button variant="ghost" size="sm" className="gap-1 text-xs">
                        <User className="h-3 w-3 text-blue-600" />
                        <span>البائع</span>
                    </Button>
                    <div className="absolute top-full right-0 mt-1 w-64 bg-white shadow-xl rounded-lg border hidden group-hover:block z-50 max-h-96 overflow-y-auto">
                        {PLACEHOLDER_OPTIONS.filter(opt => opt.category === 'seller').map(opt => (
                            <button
                                key={opt.key}
                                onClick={() => insertPlaceholder(opt.key)}
                                className="w-full text-right px-3 py-2 hover:bg-blue-50 flex items-center gap-2 text-sm"
                            >
                                {opt.icon}
                                <span>{opt.label}</span>
                                <span className="text-xs text-gray-400 mr-auto">{opt.key}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* حقول المشتري */}
                <div className="relative group">
                    <Button variant="ghost" size="sm" className="gap-1 text-xs">
                        <User className="h-3 w-3 text-green-600" />
                        <span>المشتري</span>
                    </Button>
                    <div className="absolute top-full right-0 mt-1 w-64 bg-white shadow-xl rounded-lg border hidden group-hover:block z-50 max-h-96 overflow-y-auto">
                        {PLACEHOLDER_OPTIONS.filter(opt => opt.category === 'buyer').map(opt => (
                            <button
                                key={opt.key}
                                onClick={() => insertPlaceholder(opt.key)}
                                className="w-full text-right px-3 py-2 hover:bg-green-50 flex items-center gap-2 text-sm"
                            >
                                {opt.icon}
                                <span>{opt.label}</span>
                                <span className="text-xs text-gray-400 mr-auto">{opt.key}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* حقول العقد */}
                <div className="relative group">
                    <Button variant="ghost" size="sm" className="gap-1 text-xs">
                        <FileText className="h-3 w-3 text-purple-600" />
                        <span>العقد</span>
                    </Button>
                    <div className="absolute top-full right-0 mt-1 w-64 bg-white shadow-xl rounded-lg border hidden group-hover:block z-50 max-h-96 overflow-y-auto">
                        {PLACEHOLDER_OPTIONS.filter(opt => opt.category === 'contract').map(opt => (
                            <button
                                key={opt.key}
                                onClick={() => insertPlaceholder(opt.key)}
                                className="w-full text-right px-3 py-2 hover:bg-purple-50 flex items-center gap-2 text-sm"
                            >
                                {opt.icon}
                                <span>{opt.label}</span>
                                <span className="text-xs text-gray-400 mr-auto">{opt.key}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* حقول العقار */}
                <div className="relative group">
                    <Button variant="ghost" size="sm" className="gap-1 text-xs">
                        <Home className="h-3 w-3 text-orange-600" />
                        <span>العقار</span>
                    </Button>
                    <div className="absolute top-full right-0 mt-1 w-64 bg-white shadow-xl rounded-lg border hidden group-hover:block z-50 max-h-96 overflow-y-auto">
                        {PLACEHOLDER_OPTIONS.filter(opt => opt.category === 'property').map(opt => (
                            <button
                                key={opt.key}
                                onClick={() => insertPlaceholder(opt.key)}
                                className="w-full text-right px-3 py-2 hover:bg-orange-50 flex items-center gap-2 text-sm"
                            >
                                {opt.icon}
                                <span>{opt.label}</span>
                                <span className="text-xs text-gray-400 mr-auto">{opt.key}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* حقول النظام */}
                <div className="relative group">
                    <Button variant="ghost" size="sm" className="gap-1 text-xs">
                        <Settings className="h-3 w-3 text-gray-600" />
                        <span>النظام</span>
                    </Button>
                    <div className="absolute top-full right-0 mt-1 w-64 bg-white shadow-xl rounded-lg border hidden group-hover:block z-50 max-h-96 overflow-y-auto">
                        {PLACEHOLDER_OPTIONS.filter(opt => opt.category === 'system').map(opt => (
                            <button
                                key={opt.key}
                                onClick={() => insertPlaceholder(opt.key)}
                                className="w-full text-right px-3 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm"
                            >
                                {opt.icon}
                                <span>{opt.label}</span>
                                <span className="text-xs text-gray-400 mr-auto">{opt.key}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================
// 5. المحرر الرئيسي
// ============================================

interface LexicalTemplateEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    height?: string;
}

export const LexicalTemplateEditor: React.FC<LexicalTemplateEditorProps> = ({
    value,
    onChange,
    placeholder = 'اكتب نص العقد هنا... يمكنك استخدام {{ لفتح قائمة الحقول الديناميكية',
    height = '500px'
}) => {
    const initialConfig = {
        namespace: 'TemplateEditor',
        theme: {
            paragraph: 'mb-2',
            heading: {
                h1: 'text-2xl font-bold mb-4',
                h2: 'text-xl font-bold mb-3',
                h3: 'text-lg font-bold mb-2',
            },
            text: {
                bold: 'font-bold',
                italic: 'italic',
                underline: 'underline',
            },
            list: {
                ul: 'list-disc list-inside mb-2',
                ol: 'list-decimal list-inside mb-2',
            },
            quote: 'border-r-4 border-gray-300 pr-4 italic text-gray-600 my-2',
            code: 'bg-gray-100 p-1 rounded font-mono text-sm',
        },
        onError: (error: Error) => {
            console.error(error);
        },
        nodes: [
            LinkNode, // ✅ إضافة LinkNode
            ListNode, // ✅ إضافة ListNode
            ListItemNode, // ✅ إضافة ListItemNode
        ],
        editorState: (editor: any) => {
            if (value) {
                try {
                    const parser = new DOMParser();
                    const dom = parser.parseFromString(value, 'text/html');
                    const nodes = $generateNodesFromDOM(editor, dom);
                    
                    const root = $getRoot();
                    root.clear();
                    
                    for (const node of nodes) {
                        root.append(node);
                    }
                } catch (e) {
                    console.error('Error loading editor state:', e);
                    const paragraph = $createParagraphNode();
                    paragraph.append($createTextNode(''));
                    $getRoot().append(paragraph);
                }
            } else {
                const paragraph = $createParagraphNode();
                paragraph.append($createTextNode(''));
                $getRoot().append(paragraph);
            }
        },
        direction: 'rtl',
    };

    const handleChange = (editorState: any, editor: any) => {
        editorState.read(() => {
            const html = $generateHtmlFromNodes(editor);
            onChange(html);
        });
    };

    return (
        <Card className="overflow-hidden border">
            <LexicalComposer initialConfig={initialConfig}>
                <ToolbarPlugin />
                <PlaceholderTypeaheadPlugin />
                
                <div className="relative" style={{ height, overflow: 'auto' }}>
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable 
                                className="p-4 outline-none min-h-full font-arabic leading-relaxed"
                                style={{ height, overflow: 'auto' }}
                            />
                        }
                        placeholder={
                            <div className="absolute top-4 right-4 text-gray-400 pointer-events-none">
                                {placeholder}
                            </div>
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    
                    <HistoryPlugin />
                    <ListPlugin />
                    <LinkPlugin />
                    <OnChangePlugin onChange={handleChange} />
                </div>
            </LexicalComposer>
        </Card>
    );
};