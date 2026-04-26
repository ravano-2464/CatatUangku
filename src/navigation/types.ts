import { NavigatorScreenParams } from '@react-navigation/native';
import { ScanDraft } from '../types/finance';

export type MainTabParamList = {
  Dashboard: undefined;
  AddTransaction: undefined;
  Reports: undefined;
  Budget: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  ManualInput: undefined;
  ScanReceipt: undefined;
  ScanReview: {
    draft: ScanDraft;
    imageUri?: string;
  };
};
