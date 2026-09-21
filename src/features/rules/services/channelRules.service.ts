import type { ChannelRule } from '../types/channelRules.types';
import { INITIAL_CHANNEL_RULES } from '../mocks/channelRules.mock';

const STORAGE_KEY = 'sysaf_channel_rules';

export const channelRulesService = {
  getRules: (): ChannelRule[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading channel rules from localStorage', e);
    }
    // Initialize with mock if empty
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CHANNEL_RULES));
    return INITIAL_CHANNEL_RULES;
  },

  saveRule: (rule: ChannelRule): ChannelRule[] => {
    const rules = channelRulesService.getRules();
    const existingIndex = rules.findIndex(r => r.id === rule.id);
    
    let newRules;
    if (existingIndex >= 0) {
      newRules = [...rules];
      newRules[existingIndex] = rule;
    } else {
      newRules = [rule, ...rules];
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newRules));
    return newRules;
  }
};
