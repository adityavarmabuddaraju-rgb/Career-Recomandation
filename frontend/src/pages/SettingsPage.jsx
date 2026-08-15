import React from 'react';
import { Bell, Moon, Sun, Monitor, Shield, Database, Download, Trash2, Cpu } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your application preferences and account settings.</p>
      </div>

      <div className="space-y-6">
        {/* Preferences */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Bell size={20} /></div>
            <h2 className="text-xl font-semibold text-slate-800">Notification Preferences</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-2">
              <div>
                <p className="font-medium text-slate-800">Email Notifications</p>
                <p className="text-sm text-slate-500">Receive weekly career tips and platform updates.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-2">
              <div>
                <p className="font-medium text-slate-800">Job Match Alerts</p>
                <p className="text-sm text-slate-500">Get notified when new jobs matching your profile are found.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </Card>

        {/* AI Provider */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="p-2 bg-violet-50 text-violet-600 rounded-lg"><Cpu size={20} /></div>
            <h2 className="text-xl font-semibold text-slate-800">AI Analysis Engine</h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900">Current Provider:</span>
                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded">Gemini Pro</span>
              </div>
              <p className="text-sm text-slate-500 mt-1">Using the default API key configured by the administrator.</p>
            </div>
            <Button variant="secondary" size="sm" disabled>Configure API Key</Button>
          </div>
        </Card>

        {/* Appearance */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Sun size={20} /></div>
            <h2 className="text-xl font-semibold text-slate-800">Appearance</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button className="flex flex-col items-center justify-center p-4 border-2 border-indigo-500 bg-indigo-50 rounded-xl">
              <Sun className="text-indigo-600 mb-2" size={24} />
              <span className="font-medium text-indigo-900">Light Mode</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 border-2 border-slate-200 bg-white hover:border-slate-300 rounded-xl opacity-60 cursor-not-allowed">
              <Moon className="text-slate-400 mb-2" size={24} />
              <span className="font-medium text-slate-500">Dark Mode <span className="text-[10px] block font-normal">(Coming Soon)</span></span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 border-2 border-slate-200 bg-white hover:border-slate-300 rounded-xl opacity-60 cursor-not-allowed">
              <Monitor className="text-slate-400 mb-2" size={24} />
              <span className="font-medium text-slate-500">System <span className="text-[10px] block font-normal">(Coming Soon)</span></span>
            </button>
          </div>
        </Card>

        {/* Data & Privacy */}
        <Card className="p-6 border-rose-100">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><Shield size={20} /></div>
            <h2 className="text-xl font-semibold text-rose-900">Data & Privacy</h2>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 gap-4">
              <div className="flex items-start gap-3">
                <Download className="text-slate-400 shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="font-medium text-slate-800">Export Your Data</h4>
                  <p className="text-sm text-slate-500 mt-1">Download all your resume analyses, job matches, and saved items in JSON format.</p>
                </div>
              </div>
              <Button variant="secondary" className="shrink-0">Export Data</Button>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-rose-50/50 rounded-xl border border-rose-100 gap-4">
              <div className="flex items-start gap-3">
                <Trash2 className="text-rose-500 shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="font-medium text-rose-800">Delete Account</h4>
                  <p className="text-sm text-rose-600 mt-1">Permanently remove your account and all associated data. This action cannot be undone.</p>
                </div>
              </div>
              <Button className="bg-rose-600 hover:bg-rose-700 shrink-0 text-white border-transparent">Delete Account</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
