'use client';

import { Group, Select, Button, Text } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconCalendar, IconFilter } from '@tabler/icons-react';
import { useState } from 'react';

interface AnalyticsFiltersProps {
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
}

export function AnalyticsFilters({ selectedPeriod, onPeriodChange }: AnalyticsFiltersProps) {
  const [startDate, setStartDate] = useState<Date | null>(new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const periodOptions = [
    { value: '7d', label: 'Últimos 7 dias' },
    { value: '30d', label: 'Últimos 30 dias' },
    { value: '90d', label: 'Últimos 90 dias' },
    { value: '1y', label: 'Último ano' },
    { value: 'custom', label: 'Período personalizado' }
  ];

  const handlePeriodChange = (value: string | null) => {
    if (value) {
      onPeriodChange(value);
      
      if (value !== 'custom') {
        const now = new Date();
        let days = 30;
        
        switch (value) {
          case '7d': days = 7; break;
          case '30d': days = 30; break;
          case '90d': days = 90; break;
          case '1y': days = 365; break;
        }
        
        setStartDate(new Date(now.getTime() - days * 24 * 60 * 60 * 1000));
        setEndDate(now);
      }
    }
  };

  const handleApplyFilters = () => {
    // Aqui você implementaria a lógica de aplicar os filtros
    console.log('Aplicando filtros:', { selectedPeriod, startDate, endDate });
  };

  return (
    <div>
      <Text size="lg" fw={600} c="dark" mb="md">
        🔍 Filtros de Análise
      </Text>
      
      <Group gap="md" align="end">
        <Select
          label="Período"
          placeholder="Selecione o período"
          value={selectedPeriod}
          onChange={handlePeriodChange}
          data={periodOptions}
          leftSection={<IconCalendar size={16} />}
          style={{ minWidth: 200 }}
        />
        
        {selectedPeriod === 'custom' && (
          <>
            <DateInput
              label="Data inicial"
              placeholder="Selecione a data inicial"
              value={startDate}
              onChange={(value) => setStartDate(value as Date | null)}
              style={{ minWidth: 150 }}
            />
            
            <DateInput
              label="Data final"
              placeholder="Selecione a data final"
              value={endDate}
              onChange={(value) => setEndDate(value as Date | null)}
              style={{ minWidth: 150 }}
            />
          </>
        )}
        
        <Button
          leftSection={<IconFilter size={16} />}
          onClick={handleApplyFilters}
          style={{
            background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
            border: 'none',
            '&:hover': {
              background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
            }
          }}
        >
          Aplicar Filtros
        </Button>
      </Group>
    </div>
  );
}
