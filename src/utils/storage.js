import AsyncStorage from '@react-native-async-storage/async-storage';

export const getTodayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
};
export const getWallet = async () => {
  const d = await AsyncStorage.getItem('@wallet');
  return d ? JSON.parse(d) : {balance:0,totalEarned:0,totalSpent:0};
};
export const saveWallet = async (w) => {
  await AsyncStorage.setItem('@wallet', JSON.stringify(w));
};
export const addTokensToWallet = async (amount, reason) => {
  const w = await getWallet();
  w.balance += amount; w.totalEarned += amount;
  await saveWallet(w);
  await addTransaction({type:'earn',amount,reason,date:new Date().toISOString()});
  return w;
};
export const spendTokens = async (amount, reason) => {
  const w = await getWallet();
  if(w.balance < amount) throw new Error('Insufficient tokens');
  w.balance -= amount; w.totalSpent += amount;
  await saveWallet(w);
  await addTransaction({type:'spend',amount,reason,date:new Date().toISOString()});
  return w;
};
export const getTransactions = async () => {
  const d = await AsyncStorage.getItem('@transactions');
  return d ? JSON.parse(d) : [];
};
export const addTransaction = async (tx) => {
  const txs = await getTransactions();
  txs.unshift({id:`tx_${Date.now()}`,...tx});
  await AsyncStorage.setItem('@transactions', JSON.stringify(txs.slice(0,100)));
};
export const getDailySteps = async () => {
  const d = await AsyncStorage.getItem('@dailySteps');
  return d ? JSON.parse(d) : {};
};
export const saveDailySteps = async (key, steps) => {
  const d = await getDailySteps();
  d[key] = steps;
  await AsyncStorage.setItem('@dailySteps', JSON.stringify(d));
};
export const getStreak = async () => {
  const d = await AsyncStorage.getItem('@streak');
  return d ? JSON.parse(d) : {current:0,best:0};
};
export const saveStreak = async (s) => {
  await AsyncStorage.setItem('@streak', JSON.stringify(s));
};
export const getUserProfile = async () => {
  const d = await AsyncStorage.getItem('@profile');
  return d ? JSON.parse(d) : {name:'FitWalker',avatar:'🏃',dailyGoal:10000,joinedAt:new Date().toISOString()};
};
export const saveUserProfile = async (p) => {
  await AsyncStorage.setItem('@profile', JSON.stringify(p));
};
export const getSettings = async () => {
  const d = await AsyncStorage.getItem('@settings');
  return d ? JSON.parse(d) : {dailyGoal:10000,notifications:true,haptics:true,tokenValue:0.01};
};
export const saveSettings = async (s) => {
  await AsyncStorage.setItem('@settings', JSON.stringify(s));
};
