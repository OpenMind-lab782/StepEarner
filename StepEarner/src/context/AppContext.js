import React,{createContext,useContext,useState,useEffect,useRef} from 'react';
import {Pedometer} from 'expo-sensors';
import {getWallet,addTokensToWallet,getDailySteps,saveDailySteps,getTodayKey,getStreak,saveStreak,getUserProfile,getSettings,getTransactions} from '../utils/storage';

const AppContext = createContext(null);
export const AppProvider = ({children}) => {
  const [todaySteps,setTodaySteps] = useState(0);
  const [wallet,setWallet] = useState({balance:0,totalEarned:0,totalSpent:0});
  const [streak,setStreak] = useState({current:0,best:0});
  const [weeklySteps,setWeeklySteps] = useState([]);
  const [profile,setProfile] = useState(null);
  const [settings,setSettingsState] = useState({dailyGoal:10000,haptics:true});
  const [transactions,setTransactions] = useState([]);
  const [isTracking,setIsTracking] = useState(false);
  const [isPedometerAvailable,setIsPedometerAvailable] = useState(false);
  const [newAchievement,setNewAchievement] = useState(null);
  const tokensAwarded = useRef(0);
  const sub = useRef(null);

  useEffect(()=>{init();},[]);

  const init = async () => {
    const [wal,str,prof,sett,txs,stepsData] = await Promise.all([
      getWallet(),getStreak(),getUserProfile(),getSettings(),getTransactions(),getDailySteps()
    ]);
    setWallet(wal);setStreak(str);setProfile(prof);setSettingsState(sett);setTransactions(txs);
    const todayKey = getTodayKey();
    const todayCount = stepsData[todayKey]||0;
    setTodaySteps(todayCount);
    tokensAwarded.current = Math.floor(todayCount/100);
    buildWeekly(stepsData);
    const avail = await Pedometer.isAvailableAsync();
    setIsPedometerAvailable(avail);
    if(avail){
      sub.current = Pedometer.watchStepCount(async(r)=>{
        const start=new Date();start.setHours(0,0,0,0);
        const res = await Pedometer.getStepCountAsync(start,new Date());
        const total = res?.steps||r.steps;
        setTodaySteps(total);
        await saveDailySteps(getTodayKey(),total);
        const tokens = Math.floor(total/100);
        if(tokens>tokensAwarded.current){
          const diff=tokens-tokensAwarded.current;
          tokensAwarded.current=tokens;
          const w=await addTokensToWallet(diff,`${diff*100} steps`);
          setWallet(w);
        }
      });
      setIsTracking(true);
    }
  };

  const buildWeekly = (data) => {
    const days=[];
    for(let i=6;i>=0;i--){
      const d=new Date();d.setDate(d.getDate()-i);
      const k=`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
      days.push({label:['Su','Mo','Tu','We','Th','Fr','Sa'][d.getDay()],steps:data[k]||0,key:k});
    }
    setWeeklySteps(days);
  };

  const refreshWallet = async()=>{const w=await getWallet();const txs=await getTransactions();setWallet(w);setTransactions(txs);};
  const updateProfile = async(u)=>{const p={...profile,...u};await require('../utils/storage').saveUserProfile(p);setProfile(p);};
  const updateSettings = async(u)=>{const s={...settings,...u};await require('../utils/storage').saveSettings(s);setSettingsState(s);};

  return(
    <AppContext.Provider value={{todaySteps,wallet,streak,weeklySteps,profile,settings,transactions,isTracking,isPedometerAvailable,newAchievement,refreshWallet,updateProfile,updateSettings}}>
      {children}
    </AppContext.Provider>
  );
};
export const useApp = ()=>useContext(AppContext);
