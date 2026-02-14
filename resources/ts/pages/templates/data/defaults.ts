// تعريف نوع القالب الجاهز
export interface PredefinedTemplate {
    id: string;
    name: string;
    description: string;
    contract_type: string;
    content: string;
    fields?: Array<{
        key: string;
        label: string;
        type: string;
        source: string;
        client_role?: string;
        client_field?: string;
    }>;
}

// مجموعة القوالب الجاهزة
export const PREDEFINED_TEMPLATES: PredefinedTemplate[] = [
    {
        id: 'sale-contract',
        name: 'عقد بيع عقار (نموذج موحد)',
        description: 'نموذج موحد لعقد بيع عقار حسب القانون الجزائري',
        contract_type: 'sale',
        content: `[الجمهورية الجزائرية الديمقراطية الشعبية]

[وزارة الماليــــة]

[المديرية العامة للأملاك الوطنية]

[مديرية الحفظ العقاري لولاية {{office_name}}]

[إجــراء إشهـار عقـاري]

+---------------------------------------------------------------+-------------------------------------------------------------------------------+----------------------+
| > [إيـــداع]                                                  | [في                                                                            | [رسم] |
|                                                               | {{deposit_date}}]                                                              |                      |
| [حجم {{folder_size}}]                                         |                                                                               |                      |
|                                                               | [مجلد {{folder_number}}                                                       |                      |
| [رقم {{deposit_number}}]                                      | رقم {{drawing_number}}]                                                        |                      |
+===============================================================+===============================================================================+======================+

+--------------------------------------------------------------------+-----------------------------------------------------------------------------------+
| [الهاتف رقم: {{office_phone}}]                                    | [الجمهورية الجزائرية الديمقراطية الشعبية]                                         |
+====================+===============================================+===========================+:==========================+
| [ ]                                                              | [المكتب العمومي للتوثيق | [بتاريــــخ : {{contract_date}}]              |
|                                                                    | {{office_name}}]         |                                                       |
|                                                                    |                           | [فهـرس رقم : ({{index_number}})]             |
|                                                                    +---------------------------+                                                       |
|                                                                    | [الأستــاذ : {{notary_name}}]      |                                                       |
|                                                                    +---------------------------+                                                       |
|                                                                    | [{{notary_address}}]      |                                                       |
|                                                                    +---------------------------+-------------------------------------------------------+
|                                                                    | [عـقـد بيـــع]                                                     |
|                                                                    |                                                                   |
|                                                                    | [الحمد لله وحده .]                                               |
|                                                                    |                                                                   |
|                                                                    | [لـدى الأستاذ/ {{notary_name}} موثق بالمسيلة ، دائرة اختصاص محكمة {{office_name}} الممضي أدناه.] |
|                                                                    |                                                                   |
|                                                                    | [وفي اليوم {{contract_day}} من شهر {{contract_month}} سنة {{contract_year}}.] |
|                                                                    |                                                                   |
|                                                                    | [حضــــر كـــل مــــن]                                             |
|                                                                    |                                                                   |
|                                                                    | [الــبائـع: السيد/ {{seller_full_name}} بن {{seller_father_name}} ، {{seller_nationality}} الجنسية ، {{seller_profession}} ، المولود في : {{seller_birth_date}} ({{seller_birth_date_text}}) {{seller_birth_place}} ، طبقـا لشهـادة مـيلاده المقيدة بالحـالة المدنية تحت رقم ({{seller_birth_certificate}}) ، المقيم {{seller_address}} ، الحامل لبطاقة التعريف الوطنية رقم ({{seller_id_number}}) ، الصادرة عن {{seller_id_issuing_authority}} ، بتاريخ: {{seller_id_issue_date}}.] |
|                                                                    |                                                                   |
|                                                                    | [الذي صرح أمامنا حال صحته وسلامته الظاهرة من عوارض الأهلية وعيوب الرضا، أنه باع - بموجب هذا العقد - ملتزما بجميع الضمانات القانونية و العادية المعمول بها في مثل هذا الشأن، العقار المعين أدناه لفـائـدة:] |
|                                                                    |                                                                   |
|                                                                    | [المشترية: السيدة/ {{buyer_full_name}} بنت {{buyer_father_name}} ، {{buyer_nationality}} الجنسية ، {{buyer_profession}} ، المولودة في : {{buyer_birth_date}} ({{buyer_birth_date_text}}) {{buyer_birth_place}} ، طبقـا لشهـادة مـيلادها المقيدة بالحـالة المدنية تحت رقم ({{buyer_birth_certificate}}) ، المقيمة {{buyer_address}} ، الحاملة لبطاقة التعريف الوطنية رقم ({{buyer_id_number}}) ، الصادرة عن {{buyer_id_issuing_authority}} ، بتاريخ: {{buyer_id_issue_date}}.] |
|                                                                    |                                                                   |
|                                                                    | [الحاضرة بمجلس العقد ، القابلة صراحة بشراء العقار المعين أدناه :] |
|                                                                    |                                                                   |
|                                                                    | [التعييــــن]                                                      |
|                                                                    |                                                                   |
|                                                                    | [* مجموعة ملكية رقم ({{property_number}})، قسم ({{section}}) عبارة عن قطعة ارض صالحة لبناء سكن ، تحمل رقم ({{plot_number}}) من المخطط الخصوصي للتجزئة الترابية ({{subdivision}}) قطعة، تبلغ مساحتها {{area}} متر مربع ({{area}}م²), كائنة بالمكان المسمى {{location}} بتراب بلدية {{office_name}} .] |
|                                                                    |                                                                   |
|                                                                    | [* مثلما هي مدرجة ومحددة في العقد والدفتر العقاري المعتمدين كسند أصل الملكية ، وهي معروفة أتم] |
|                                                                    |                                                                   |
|                                                                    | [(الصفحة الأولى ~01/04~)]                                          |`,
    },
    {
        id: 'rent-contract',
        name: 'عقد كراء',
        description: 'نموذج عقد كراء سكني أو تجاري',
        contract_type: 'rent',
        body: `[الجمهورية الجزائرية الديمقراطية الشعبية]

[عقد كراء]

بين:
المكري: {{owner_name}}
والمكتري: {{tenant_name}}

...`,
    },
    {
        id: 'power-of-attorney',
        name: 'وكالة',
        description: 'نموذج وكالة عامة أو خاصة',
        contract_type: 'power_of_attorney',
        body: `[الجمهورية الجزائرية الديمقراطية الشعبية]

[وكالة]

...`,
    },
];

// دوال مساعدة للقوالب
export const getTemplateById = (id: string): PredefinedTemplate | undefined => {
    return PREDEFINED_TEMPLATES.find(t => t.id === id);
};

export const getTemplatesByType = (type: string): PredefinedTemplate[] => {
    return PREDEFINED_TEMPLATES.filter(t => t.contract_type === type);
};