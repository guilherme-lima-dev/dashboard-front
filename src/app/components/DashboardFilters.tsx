'use client';

import React, { useState, useEffect } from 'react';
import {
  Paper,
  Group,
  Select,
  Button,
  Text,
  Stack,
  Collapse,
  Grid,
} from '@mantine/core';
import { DatePickerInput, DatesProvider } from '@mantine/dates';
import { IconFilter, IconRefresh, IconChevronDown, IconChevronUp, IconCalendar } from '@tabler/icons-react';
import { useAnalytics } from '../contexts/AnalyticsContext';
import { DashboardFilters as FilterType } from '../services/analyticsService';
import 'dayjs/locale/pt-br';

interface DashboardFiltersProps {
  onFiltersChange?: (filters: any) => void;
}

export default function DashboardFilters({ onFiltersChange }: DashboardFiltersProps) {
  const { filters, updateFilters } = useAnalytics();
  const [platform, setPlatform] = useState<string | null>(filters.platformId || 'all');
  const [dateRange, setDateRange] = useState<string | null>('30d');
  const [acquisitionChannel, setAcquisitionChannel] = useState<string | null>(filters.acquisitionChannel || 'all');
  const [isOpen, setIsOpen] = useState(false);
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);

  const getDateRangeFromFilters = (startDate?: string, endDate?: string): string => {
    if (!startDate || !endDate) return '30d';
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (startDate === todayStr && endDate === todayStr) return 'today';
    
    if (startDate === yesterdayStr && endDate === yesterdayStr) return 'yesterday';
    
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];
    if (startDate === sevenDaysAgoStr && endDate === todayStr) return '7d';
    
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];
    if (startDate === thirtyDaysAgoStr && endDate === todayStr) return '30d';
    
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayOfMonthStr = firstDayOfMonth.toISOString().split('T')[0];
    if (startDate === firstDayOfMonthStr && endDate === todayStr) return 'thisMonth';
    
    return 'custom';
  };

  const calculateDateRange = (range: string): { startDate: string; endDate: string } => {
    const today = new Date();
    const endDate = today.toISOString().split('T')[0];
    let startDate: string;

    switch (range) {
      case 'today':
        startDate = endDate;
        break;
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        startDate = yesterday.toISOString().split('T')[0];
        break;
      case '7d':
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        startDate = sevenDaysAgo.toISOString().split('T')[0];
        break;
      case '30d':
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        startDate = thirtyDaysAgo.toISOString().split('T')[0];
        break;
      case 'thisMonth':
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        startDate = firstDayOfMonth.toISOString().split('T')[0];
        break;
      case 'max':
        const maxDate = new Date('2020-01-01');
        startDate = maxDate.toISOString().split('T')[0];
        break;
      default:
        const defaultDate = new Date(today);
        defaultDate.setDate(defaultDate.getDate() - 30);
        startDate = defaultDate.toISOString().split('T')[0];
    }

    return { startDate, endDate };
  };

  useEffect(() => {
    const currentRange = getDateRangeFromFilters(filters.startDate, filters.endDate);
    setDateRange(currentRange);
    
    if (currentRange === 'custom' && filters.startDate && filters.endDate) {
      setCustomStartDate(new Date(filters.startDate));
      setCustomEndDate(new Date(filters.endDate));
    }
  }, [filters.startDate, filters.endDate]);

  const handleFilterChange = (key: string, value: string | null) => {
    if (!value) return;

    let newFilters: Partial<FilterType> = {};

    if (key === 'platform') {
      setPlatform(value);
      newFilters.platformId = value === 'all' ? undefined : value;
    }
    
    if (key === 'dateRange') {
      setDateRange(value);
      if (value !== 'custom') {
        const dateRange = calculateDateRange(value);
        newFilters.startDate = dateRange.startDate;
        newFilters.endDate = dateRange.endDate;
        setCustomStartDate(null);
        setCustomEndDate(null);
      }
    }
    
    if (key === 'acquisitionChannel') {
      setAcquisitionChannel(value);
      newFilters.acquisitionChannel = value === 'all' ? undefined : value;
    }

    updateFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleCustomDateChange = (startDate: Date | null, endDate: Date | null) => {
    setCustomStartDate(startDate);
    setCustomEndDate(endDate);
    
    if (startDate && endDate) {
      const start = startDate instanceof Date ? startDate : new Date(startDate);
      const end = endDate instanceof Date ? endDate : new Date(endDate);
      
      const newFilters: Partial<FilterType> = {
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0]
      };
      
      updateFilters(newFilters);
      onFiltersChange?.(newFilters);
    
      setIsOpen(true);
    }
  };

  const handleReset = () => {
    setPlatform('all');
    setDateRange('30d');
    setAcquisitionChannel('all');
    setCustomStartDate(null);
    setCustomEndDate(null);
    
    const resetFilters: Partial<FilterType> = {
      platformId: undefined,
      acquisitionChannel: undefined,
      ...calculateDateRange('30d')
    };
    
    updateFilters(resetFilters);
    onFiltersChange?.(resetFilters);
  };

  return (
    <DatesProvider settings={{ locale: 'pt-br' }}>
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
                  { value: 'stripe', label: 'Stripe' },
                  { value: 'cartpanda', label: 'Cartpanda' },
                  { value: 'hotmart', label: 'Hotmart' },
                  { value: 'appstore', label: 'App Store' },
                ]}
              />

              <Select
                label="Período"
                placeholder="Selecione o período"
                value={dateRange}
                onChange={(value) => handleFilterChange('dateRange', value)}
                data={[
                  { value: 'today', label: 'Hoje' },
                  { value: 'yesterday', label: 'Ontem' },
                  { value: '7d', label: 'Últimos 7 dias' },
                  { value: '30d', label: 'Últimos 30 dias' },
                  { value: 'thisMonth', label: 'Este mês' },
                  { value: 'max', label: 'Máximo' },
                  { value: 'custom', label: 'Personalizado' },
                ]}
              />

              <Select
                label="Canal de Aquisição"
                placeholder="Selecione o canal"
                value={acquisitionChannel}
                onChange={(value) => handleFilterChange('acquisitionChannel', value)}
                data={[
                  { value: 'all', label: 'Todos os Canais' },
                  { value: 'meta_ads', label: 'Meta Ads' },
                  { value: 'tiktok', label: 'TikTok' },
                  { value: 'google', label: 'Google' },
                  { value: 'organic', label: 'Orgânico' },
                  { value: 'email', label: 'Email Marketing' },
                  { value: 'referral', label: 'Indicação' },
                ]}
              />
            </Group>

            {(dateRange === 'custom' || (customStartDate && customEndDate)) && (
              <Grid mt="md">
                <Grid.Col span={6}>
                  <DatePickerInput
                    label="Data de Início"
                    placeholder="Selecione a data de início"
                    value={customStartDate}
                    onChange={(date) => {
                      const dateValue = date ? new Date(date) : null;
                      setCustomStartDate(dateValue);
                      if (dateValue && customEndDate) {
                        handleCustomDateChange(dateValue, customEndDate);
                      }
                    }}
                    maxDate={customEndDate || new Date()}
                    leftSection={<IconCalendar size={16} />}
                    clearable
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <DatePickerInput
                    label="Data de Fim"
                    placeholder="Selecione a data de fim"
                    value={customEndDate}
                    onChange={(date) => {
                      const dateValue = date ? new Date(date) : null;
                      setCustomEndDate(dateValue);
                      if (customStartDate && dateValue) {
                        handleCustomDateChange(customStartDate, dateValue);
                      }
                    }}
                    minDate={customStartDate || undefined}
                    maxDate={new Date()}
                    leftSection={<IconCalendar size={16} />}
                    clearable
                  />
                </Grid.Col>
              </Grid>
            )}
          </Stack>
        </Collapse>
      </Paper>
    </DatesProvider>
  );
}