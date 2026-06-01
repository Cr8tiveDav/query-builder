import { Schema } from '@/types/query';

export const SCHEMAS: Schema[] = [
  {
    id: 'users',
    name: 'Users Database',
    fields: [
      {
        name: 'name',
        label: 'Name',
        type: 'string',
        operators: ['equals', 'not equals', 'contains', 'starts with', 'regex'],
      },
      {
        name: 'age',
        label: 'Age',
        type: 'number',
        operators: ['equals', 'not equals', 'greater than', 'less than', 'between'],
      },
      {
        name: 'status',
        label: 'Status',
        type: 'enum',
        operators: ['equals', 'not equals', 'in array'],
        options: ['active', 'inactive', 'pending'],
      },
      {
        name: 'country',
        label: 'Country',
        type: 'string',
        operators: ['equals', 'not equals', 'contains', 'starts with'],
      },
      {
        name: 'purchases',
        label: 'Purchases Count',
        type: 'number',
        operators: ['equals', 'not equals', 'greater than', 'less than', 'between'],
      },
      {
        name: 'createdAt',
        label: 'Created At',
        type: 'date',
        operators: ['equals', 'not equals', 'greater than', 'less than', 'between'],
      },
      {
        name: 'isActive',
        label: 'Is Active',
        type: 'boolean',
        operators: ['equals'],
      },
    ],
  },
  {
    id: 'products',
    name: 'E-Commerce Products',
    fields: [
      {
        name: 'title',
        label: 'Title',
        type: 'string',
        operators: ['equals', 'not equals', 'contains', 'starts with'],
      },
      {
        name: 'price',
        label: 'Price',
        type: 'number',
        operators: ['equals', 'not equals', 'greater than', 'less than', 'between'],
      },
      {
        name: 'category',
        label: 'Category',
        type: 'enum',
        operators: ['equals', 'not equals', 'in array'],
        options: ['electronics', 'clothing', 'home', 'books', 'sports'],
      },
      {
        name: 'stock',
        label: 'Stock Quantity',
        type: 'number',
        operators: ['equals', 'not equals', 'greater than', 'less than', 'between'],
      },
      {
        name: 'rating',
        label: 'Rating',
        type: 'number',
        operators: ['equals', 'not equals', 'greater than', 'less than', 'between'],
      },
      {
        name: 'releaseDate',
        label: 'Release Date',
        type: 'date',
        operators: ['equals', 'not equals', 'greater than', 'less than', 'between'],
      },
      {
        name: 'isFeatured',
        label: 'Is Featured',
        type: 'boolean',
        operators: ['equals'],
      },
    ],
  },
  {
    id: 'logs',
    name: 'Application Logs',
    fields: [
      {
        name: 'level',
        label: 'Log Level',
        type: 'enum',
        operators: ['equals', 'not equals', 'in array'],
        options: ['info', 'warn', 'error', 'debug'],
      },
      {
        name: 'message',
        label: 'Message',
        type: 'string',
        operators: ['equals', 'contains', 'starts with', 'regex'],
      },
      {
        name: 'statusCode',
        label: 'Status Code',
        type: 'number',
        operators: ['equals', 'not equals', 'greater than', 'less than', 'between', 'in array'],
      },
      {
        name: 'serviceName',
        label: 'Service Name',
        type: 'string',
        operators: ['equals', 'not equals', 'contains'],
      },
      {
        name: 'ipAddress',
        label: 'IP Address',
        type: 'string',
        operators: ['equals', 'starts with'],
      },
      {
        name: 'timestamp',
        label: 'Timestamp',
        type: 'date',
        operators: ['equals', 'not equals', 'greater than', 'less than', 'between'],
      },
    ],
  },
];
