export const oilFields = [
    {
        key: 'title',
        label: 'Oil Name',
        type: 'text',
        required: true,
        placeholder: 'Enter oil name',
        helper: 'e.g., Coconut, Almond, Sesame, etc.',
        minLength: 2,
        maxLength: 50
    },
    {
        key: 'price',
        label: 'Price per Kg (Rs)',
        type: 'number',
        required: true,
        placeholder: 'Enter price in Pakistani Rupees',
        helper: 'Price should be a positive number',
        defaultValue: 0
    },
];

// Product form fields
export
    const productFields = [
        {
            key: 'title',
            label: 'Product Name',
            type: 'text',
            required: true,
            placeholder: 'Enter product name',
            helper: 'e.g., Hair Oil, Massage Oil, etc.',
            minLength: 2,
            maxLength: 50
        },
    ];

// Bottle form fields configuration

export
    const bottleFields = [
        {
            key: 'size',
            label: 'Bottle Size',
            type: 'text',
            required: true,
            placeholder: 'e.g., 0.1kg, 0.2kg, 0.5kg',
            helper: 'Specify the bottle capacity',
            minLength: 2,
            maxLength: 20
        },
        {
            key: 'price',
            label: 'Bottle Price (Rs)',
            type: 'number',
            required: true,
            placeholder: 'Enter bottle cost',
            helper: 'Cost of the empty bottle',
            defaultValue: 0
        },
        {
            key: 'stickerCost',
            label: 'Sticker Cost (Rs)',
            type: 'number',
            required: true,
            placeholder: 'Enter sticker cost',
            helper: 'Cost of labeling/sticker',
            defaultValue: 0
        },
        {
            key: 'boxCost',
            label: 'Box/Packaging Cost (Rs)',
            type: 'number',
            required: true,
            placeholder: 'Enter box cost',
            helper: 'Cost of outer packaging',
            defaultValue: 0
        },
        {
            key: 'labourCharges',
            label: 'Labour Charges (Rs)',
            type: 'number',
            required: true,
            placeholder: 'Enter labour cost',
            helper: 'Cost of filling and packaging labor',
            defaultValue: 0
        },
        {
            key: 'extraCharges',
            label: 'Extra Charges (Rs)',
            type: 'number',
            placeholder: 'Enter any additional costs',
            helper: 'Any miscellaneous charges',
            defaultValue: 0
        },
    ];

    export const ManagementTabs = [
  { key: "manage_oils", route: "ManageOils" },
  { key: "manage_products", route: "ManageProducts" },
  { key: "manage_bottle", route: "ManageBottle" }
];