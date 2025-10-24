'use client';

import { Table, Badge, Group, Text, ActionIcon, Skeleton, ScrollArea, Paper } from '@mantine/core';
import { IconEye, IconEdit, IconTrash, IconDownload } from '@tabler/icons-react';
import { ReactNode } from 'react';

interface Column<T> {
  accessor: string;
  title: string;
  render?: (value: any, record: T) => ReactNode;
  sortable?: boolean;
  width?: string;
}

interface CustomDataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
  onExport?: (row: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  showActions?: boolean;
  height?: string;
}

export function DataTable<T>({
  data,
  columns,
  onRowClick,
  onEdit,
  onDelete,
  onView,
  onExport,
  loading = false,
  emptyMessage = 'Nenhum dado encontrado',
  showActions = true,
  height = '400px'
}: CustomDataTableProps<T>) {
  if (loading) {
    return (
      <div>
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} height={50} mb="xs" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <Paper p="xl" ta="center">
        <Text c="dimmed" size="lg">
          {emptyMessage}
        </Text>
      </Paper>
    );
  }

  const getValue = (record: T, accessor: string) => {
    return accessor.split('.').reduce((obj, key) => obj?.[key], record as any);
  };

  return (
    <Paper withBorder radius="md">
      <ScrollArea h={height}>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              {columns.map((column) => (
                <Table.Th key={column.accessor} style={{ width: column.width }}>
                  {column.title}
                </Table.Th>
              ))}
              {showActions && (
                <Table.Th style={{ width: 120, textAlign: 'right' }}>
                  Ações
                </Table.Th>
              )}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.map((record, index) => (
              <Table.Tr
                key={index}
                style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                onClick={() => onRowClick?.(record)}
              >
                {columns.map((column) => (
                  <Table.Td key={column.accessor}>
                    {column.render
                      ? column.render(getValue(record, column.accessor), record)
                      : getValue(record, column.accessor)}
                  </Table.Td>
                ))}
                {showActions && (
                  <Table.Td style={{ textAlign: 'right' }}>
                    <Group gap="xs" justify="flex-end">
                      {onView && (
                        <ActionIcon
                          variant="subtle"
                          color="blue"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onView(record);
                          }}
                        >
                          <IconEye size={16} />
                        </ActionIcon>
                      )}
                      {onEdit && (
                        <ActionIcon
                          variant="subtle"
                          color="orange"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(record);
                          }}
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                      )}
                      {onExport && (
                        <ActionIcon
                          variant="subtle"
                          color="green"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onExport(record);
                          }}
                        >
                          <IconDownload size={16} />
                        </ActionIcon>
                      )}
                      {onDelete && (
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(record);
                          }}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      )}
                    </Group>
                  </Table.Td>
                )}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Paper>
  );
}

// Componente para status badge
export function StatusBadge({ 
  status, 
  color 
}: { 
  status: string; 
  color?: string 
}) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'completed':
      case 'success':
        return 'green';
      case 'inactive':
      case 'cancelled':
      case 'failed':
        return 'red';
      case 'pending':
      case 'processing':
        return 'yellow';
      case 'paused':
        return 'orange';
      default:
        return color || 'gray';
    }
  };

  return (
    <Badge 
      color={getStatusColor(status)} 
      variant="light"
      size="sm"
      radius="md"
    >
      {status}
    </Badge>
  );
}

// Componente para valor monetário
export function CurrencyValue({ 
  value, 
  currency = 'BRL' 
}: { 
  value: number; 
  currency?: string 
}) {
  const { formatCurrency } = useSafeFormat();

  return (
    <Text fw={500}>
      {formatCurrency(value, currency)}
    </Text>
  );
}

// Componente para data formatada
export function FormattedDate({ 
  date, 
  format = 'short' 
}: { 
  date: string; 
  format?: 'short' | 'long' | 'time' 
}) {
  const { formatDate, formatDateTime } = useSafeFormat();

  const formatDateValue = (date: string, format: string) => {
    const d = new Date(date);
    
    switch (format) {
      case 'short':
        return formatDate(d);
      case 'long':
        return formatDate(d, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      case 'time':
        return formatDateTime(d);
      default:
        return formatDate(d);
    }
  };

  return (
    <Text size="sm">
      {formatDateValue(date, format)}
    </Text>
  );
}