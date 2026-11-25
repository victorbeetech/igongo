// One icon per module, so a module looks the same in every menu, tile and
// search result. Change a module's icon here and it changes everywhere.

import {
  Apple, Archive, BadgeCheck, Banknote, BarChart3, Bath, Bell, BookOpen, Boxes, Briefcase, Building2, Bus, CalendarDays, CalendarRange,
  ChefHat, ClipboardCheck, ClipboardList, Contact, CreditCard, Database, DoorOpen, FileClock, FileText, Files, FormInput, Gavel, Gift, Globe,
  GraduationCap, HandCoins, HandHeart, Handshake, HardHat, History, Home, Hotel, KeyRound, Landmark, Languages, LayoutDashboard, LifeBuoy,
  ListChecks, type LucideIcon, Mail, Map, Megaphone, MessageCircle, MessagesSquare, Nfc, Package, PartyPopper, Percent, Receipt, RefreshCw,
  Search, Settings2, Shield, ShieldCheck, ShoppingBag, Soup, Sparkles, Star, Store, Table2, Tag, Ticket, TrendingUp, Truck, Users, UserCog,
  UserPlus, Utensils, UtensilsCrossed, Warehouse, Watch, Waves, Webhook, Workflow, Wrench, MonitorSmartphone, Wallet,
} from "lucide-react";

// The icon for each module code.
const ICONS: Record<string, LucideIcon> = {
  "00": Home, "01": ShieldCheck, "02": BadgeCheck, "03": LayoutDashboard, "04": UserCog, "05": History, "06": Archive, "07": Settings2,
  "08": FormInput, "09": Workflow, "10": Bell, "11": Files, "12": Languages, "13": Database, "14": Webhook, "15": Building2,
  "16": Nfc, "17": Watch, "18": MonitorSmartphone, "19": Shield, "20": UserPlus, "21": KeyRound, "22": Contact, "23": Briefcase,
  "24": Handshake, "25": FileClock, "26": CalendarRange, "27": Bath, "28": Banknote, "29": Receipt, "30": HandCoins, "31": Gift,
  "32": Utensils, "33": TrendingUp, "34": GraduationCap, "35": Gavel, "36": HandHeart, "37": Wallet, "38": ClipboardList, "39": ClipboardCheck,
  "40": Wrench, "41": Package, "42": ListChecks, "43": Sparkles, "44": RefreshCw, "45": HardHat, "46": Search, "47": Bus,
  "48": BookOpen, "49": Megaphone, "50": MessageCircle, "51": Users, "52": BarChart3, "53": CalendarDays, "54": Contact, "55": Building2,
  "56": Star, "57": Ticket, "58": Mail, "59": Tag, "60": LifeBuoy, "61": UtensilsCrossed, "62": Soup, "63": ChefHat,
  "64": Table2, "65": Apple, "66": Truck, "67": Hotel, "68": Landmark, "69": PartyPopper, "70": DoorOpen, "71": Waves,
  "72": Sparkles, "73": ShoppingBag, "74": MessagesSquare, "75": Globe, "76": Percent, "77": CreditCard, "78": FileText, "79": Store,
  "80": Landmark, "81": BarChart3, "82": RefreshCw, "83": Map, "84": Warehouse,
};

/** The icon for module [code], or a box when the code is unknown. */
export const moduleIcon = (code: string): LucideIcon => ICONS[code] ?? Boxes;

/** The icon for a screen or dialog number, from its module. */
export const iconFor = (id: string): LucideIcon => moduleIcon(id.slice(1, 3));
