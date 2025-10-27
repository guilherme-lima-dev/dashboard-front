'use client';

import React, { useState } from 'react';
import {
  Paper,
  Group,
  Select,
  Button,
  Text,
  Stack,
  Collapse,
} from '@mantine/core';
import { IconFilter, IconRefresh, IconChevronDown, IconChevronUp } from '@tabler/icons-react';

interface DashboardFiltersProps {
  onFiltersChange: (filters: any) => void;
}

export default function DashboardFilters({ onFiltersChange }: DashboardFiltersProps) {
  const [platform, setPlatform] = useState<string | null>('all');
  const [dateRange, setDateRange] = useState<string | null>('30d');
  const [acquisitionChannel, setAcquisitionChannel] = useState<string | null>('all');
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (key: string, value: string | null) => {
    const newFilters = {
      platform: key === 'platform' ? value : platform,
      dateRange: key === 'dateRange' ? value : dateRange,
      acquisitionChannel: key === 'acquisitionChannel' ? value : acquisitionChannel,
    };
    
    if (key === 'platform') setPlatform(value);
    if (key === 'dateRange') setDateRange(value);
    if (key === 'acquisitionChannel') setAcquisitionChannel(value);
    
    onFiltersChange(newFilters);
  };

  const handleReset = () => {
    setPlatform('all');
    setDateRange('30d');
    setAcquisitionChannel('all');
    onFiltersChange({
      platform: 'all',
      dateRange: '30d',
      acquisitionChannel: 'all',
    });
  };

  return (
    <Paper p="md" mb="lg" withBorder>
      <Group justify="space-between" mb={isOpen ? "md" : 0}>
        <Button
          variant="subtle"
          leftSection={<IconFilter size={20} />}
          rightSection={isOpen ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
          onClick={() => setIsOpen(!isOpen)}
          size="md"
          style={{ fontWeight: 600 }}
        >
          Filtros
        </Button>
        
        {isOpen && (
          <Button
            variant="light"
            size="sm"
            leftSection={<IconRefresh size={16} />}
            onClick={handleReset}
          >
            Limpar
          </Button>
        )}
      </Group>

      <Collapse in={isOpen}>
        <Stack gap="md" pt="md">
          <Group grow>
            <Select
              label="Plataforma"
              placeholder="Selecione a plataforma"
              value={platform}
              onChange={(value) => handleFilterChange('platform', value)}
              data={[
                { value: 'all', label: 'Todas as Plataformas' },
                { value: 'web', label: 'Web' },
                { value: 'mobile', label: 'Mobile' },
                { value: 'desktop', label: 'Desktop' },
              ]}
            />

            <Select
              label="Período"
              placeholder="Selecione o período"
              value={dateRange}
              onChange={(value) => handleFilterChange('dateRange', value)}
              data={[
                { value: '7d', label: 'Últimos 7 dias' },
                { value: '30d', label: 'Últimos 30 dias' },
                { value: '90d', label: 'Últimos 90 dias' },
                { value: '1y', label: 'Último ano' },
              ]}
            />

            <Select
              label="Canal de Aquisição"
              placeholder="Selecione o canal"
              value={acquisitionChannel}
              onChange={(value) => handleFilterChange('acquisitionChannel', value)}
              data={[
                { value: 'all', label: 'Todos os Canais' },
                { value: 'organic', label: 'Orgânico' },
                { value: 'paid', label: 'Pago' },
                { value: 'social', label: 'Redes Sociais' },
                { value: 'email', label: 'Email Marketing' },
                { value: 'referral', label: 'Indicação' },
              ]}
            />
          </Group>
        </Stack>
      </Collapse>
    </Paper>
  );
}