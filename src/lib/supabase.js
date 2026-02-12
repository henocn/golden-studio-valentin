import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rgnjhvvboxelyewwqekt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnbmpodnZib3hlbHlld3dxZWt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4OTA4NjMsImV4cCI6MjA4NjQ2Njg2M30.8huCao1PO2xiJhghooUQnksASA-q2jr2N8Yjx5aOQI8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})
