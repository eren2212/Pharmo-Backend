const { createClient } = require("@supabase/supabase-js");

let instance = null;
class Database {
  constructor() {
    if (!instance) {
      this.supabaseConnection = null;
      instance = this;
    }
    return instance;
  }

  async connect() {
    try {
      console.log("🔄 Supabase'e bağlanmaya çalışılıyor...");
      console.log(
        "📍 SUPABASE_URL:",
        process.env.SUPABASE_URL ? "✅ Mevcut" : "❌ Bulunamadı"
      );
      console.log(
        "🔑 SUPABASE_KEY:",
        process.env.SUPABASE_KEY ? "✅ Mevcut" : "❌ Bulunamadı"
      );

      let db = await createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_KEY
      );

      this.supabaseConnection = db;

      // Bağlantı testi yapalım
      const { data, error } = await db.from("users").select("*").limit(1);

      if (error && error.code !== "PGRST116") {
        // PGRST116 = table not found, bu normal
        console.log("⚠️  Supabase bağlantı uyarısı:", error.message);
      } else {
        console.log("✅ Supabase bağlantısı başarılı!");
      }
    } catch (error) {
      console.error("❌ Supabase bağlantı hatası:", error.message);
      throw error;
    }
  }

  getConnection() {
    if (!this.supabaseConnection) {
      throw new Error(
        "Veritabanı bağlantısı henüz kurulmadı. Önce connect() metodunu çağırın."
      );
    }
    return this.supabaseConnection;
  }
}

module.exports = Database;
