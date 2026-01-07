"use client";

import { useState } from "react";

const dummySettings = [
  {
    category: "System",
    settings: [
      { name: "System Name", value: "DOLE Support System", type: "text" },
      { name: "Maintenance Mode", value: false, type: "toggle" },
      { name: "Auto Backup", value: true, type: "toggle" },
      { name: "Backup Frequency", value: "Daily", type: "select" },
    ],
  },
  {
    category: "Notifications",
    settings: [
      { name: "Email Notifications", value: true, type: "toggle" },
      { name: "SMS Notifications", value: false, type: "toggle" },
      { name: "Push Notifications", value: true, type: "toggle" },
      { name: "Notification Sound", value: true, type: "toggle" },
    ],
  },
  {
    category: "Security",
    settings: [
      { name: "Two-Factor Authentication", value: true, type: "toggle" },
      { name: "Password Expiry Days", value: "90", type: "number" },
      { name: "Session Timeout (minutes)", value: "30", type: "number" },
      { name: "Login Attempts Limit", value: "5", type: "number" },
    ],
  },
  {
    category: "General",
    settings: [
      { name: "Language", value: "English", type: "select" },
      { name: "Timezone", value: "Asia/Manila", type: "select" },
      { name: "Date Format", value: "MM/DD/YYYY", type: "select" },
      { name: "Items Per Page", value: "25", type: "number" },
    ],
  },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState(dummySettings);

  const handleToggle = (categoryIndex, settingIndex) => {
    const updatedSettings = [...settings];
    updatedSettings[categoryIndex].settings[settingIndex].value =
      !updatedSettings[categoryIndex].settings[settingIndex].value;
    setSettings(updatedSettings);
  };

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <div className="w-full flex flex-col h-full overflow-hidden">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 flex-shrink-0">Settings</h1>

        <div className="flex-1 overflow-y-auto min-h-0 space-y-6">
          {settings.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">
                {category.category}
              </h2>
              <div className="space-y-4">
                {category.settings.map((setting, settingIndex) => (
                  <div
                    key={settingIndex}
                    className="flex items-center justify-between py-2 border-b border-gray-100"
                  >
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-700">
                        {setting.name}
                      </label>
                      {setting.type === "text" && (
                        <p className="text-sm text-gray-500 mt-1">{setting.value}</p>
                      )}
                    </div>
                    <div className="ml-4">
                      {setting.type === "toggle" && (
                        <button
                          onClick={() => handleToggle(categoryIndex, settingIndex)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            setting.value ? "bg-blue-600" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              setting.value ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      )}
                      {setting.type === "select" && (
                        <select className="px-3 py-1 border border-gray-300 rounded text-sm">
                          <option>{setting.value}</option>
                        </select>
                      )}
                      {setting.type === "number" && (
                        <input
                          type="number"
                          defaultValue={setting.value}
                          className="px-3 py-1 border border-gray-300 rounded text-sm w-24"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
