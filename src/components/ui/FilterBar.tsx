'use client';

import { 
  Group, 
  TextInput, 
  Select, 
  Button, 
  Card, 
  Stack,
  Badge,
  ActionIcon,
  Text
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconSearch, IconFilter, IconX, IconCalendar } from '@tabler/icons-react';
import { useState } from 'react';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  
  filters?: Array<{
    key: string;
    label: string;
    type: 'select' | 'date' | 'text';
    options?: FilterOption[];
    value?: any;
    onChange?: (value: any) => void;
    placeholder?: string;
  }>;
  
  onClearFilters?: () => void;
  onApplyFilters?: () => void;
  
  showSearch?: boolean;
  showFilters?: boolean;
  loading?: boolean;
}

export function FilterBar({
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Buscar...',
  filters = [],
  onClearFilters,
  onApplyFilters,
  showSearch = true,
  showFilters = true,
  loading = false
}: FilterBarProps) {
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});

  const handleFilterChange = (key: string, value: any) => {
    setActiveFilters(prev => ({
      ...prev,
      [key]: value
    }));
    
    const filter = filters.find(f => f.key === key);
    if (filter?.onChange) {
      filter.onChange(value);
    }
  };

  const handleClearFilters = () => {
    setActiveFilters({});
    if (onClearFilters) {
      onClearFilters();
    }
  };

  const activeFiltersCount = Object.values(activeFilters).filter(value => 
    value !== undefined && value !== null && value !== ''
  ).length;

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between">
          <Text size="sm" fw={500} c="dark">
            Filtros
          </Text>
          {activeFiltersCount > 0 && (
            <Badge color="lilac" variant="light" size="sm">
              {activeFiltersCount} filtro{activeFiltersCount > 1 ? 's' : ''} ativo{activeFiltersCount > 1 ? 's' : ''}
            </Badge>
          )}
        </Group>

        <Group gap="md" wrap="wrap">
          {showSearch && (
            <TextInput
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              leftSection={<IconSearch size={16} />}
              style={{ minWidth: 200 }}
              disabled={loading}
            />
          )}

          {showFilters && filters.map((filter) => (
            <div key={filter.key} style={{ minWidth: 150 }}>
              {filter.type === 'select' && (
                <Select
                  label={filter.label}
                  placeholder={filter.placeholder || `Selecione ${filter.label.toLowerCase()}`}
                  data={filter.options || []}
                  value={activeFilters[filter.key] || filter.value}
                  onChange={(value) => handleFilterChange(filter.key, value)}
                  clearable
                  disabled={loading}
                />
              )}
              
              {filter.type === 'date' && (
                <DateInput
                  label={filter.label}
                  placeholder={filter.placeholder || `Selecione ${filter.label.toLowerCase()}`}
                  value={activeFilters[filter.key] || filter.value}
                  onChange={(value) => handleFilterChange(filter.key, value)}
                  leftSection={<IconCalendar size={16} />}
                  clearable
                  disabled={loading}
                />
              )}
              
              {filter.type === 'text' && (
                <TextInput
                  label={filter.label}
                  placeholder={filter.placeholder || `Digite ${filter.label.toLowerCase()}`}
                  value={activeFilters[filter.key] || filter.value}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                  disabled={loading}
                />
              )}
            </div>
          ))}
        </Group>

        {(activeFiltersCount > 0 || onApplyFilters) && (
          <Group justify="space-between">
            <Group gap="xs">
              {activeFiltersCount > 0 && (
                <Button
                  variant="subtle"
                  color="red"
                  size="sm"
                  leftSection={<IconX size={16} />}
                  onClick={handleClearFilters}
                  disabled={loading}
                >
                  Limpar Filtros
                </Button>
              )}
            </Group>

            {onApplyFilters && (
              <Button
                variant="filled"
                color="lilac"
                size="sm"
                leftSection={<IconFilter size={16} />}
                onClick={onApplyFilters}
                loading={loading}
              >
                Aplicar Filtros
              </Button>
            )}
          </Group>
        )}
      </Stack>
    </Card>
  );
}

// Componente para filtros de período
export function PeriodFilter({
  value,
  onChange,
  loading = false
}: {
  value: string;
  onChange: (value: string) => void;
  loading?: boolean;
}) {
  const periodOptions = [
    { value: '7d', label: 'Últimos 7 dias' },
    { value: '30d', label: 'Últimos 30 dias' },
    { value: '90d', label: 'Últimos 90 dias' },
    { value: '1y', label: 'Último ano' },
  ];

  return (
    <Select
      label="Período"
      placeholder="Selecione o período"
      data={periodOptions}
      value={value}
      onChange={onChange}
      disabled={loading}
      style={{ minWidth: 150 }}
    />
  );
}

// Componente para filtros de plataforma
export function PlatformFilter({
  value,
  onChange,
  platforms = [],
  loading = false
}: {
  value: string;
  onChange: (value: string) => void;
  platforms: Array<{ id: string; name: string }>;
  loading?: boolean;
}) {
  const platformOptions = platforms.map(platform => ({
    value: platform.id,
    label: platform.name
  }));

  return (
    <Select
      label="Plataforma"
      placeholder="Todas as plataformas"
      data={platformOptions}
      value={value}
      onChange={onChange}
      clearable
      disabled={loading}
      style={{ minWidth: 150 }}
    />
  );
}
