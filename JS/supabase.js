console.log("Initialisierung Supabase");

// Supabase Initialisierung
const supabaseUrl = 'https://mompkygdxwraijhdwjnj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vbXBreWdkeHdyYWlqaGR3am5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYzMzY2NzQsImV4cCI6MjAxMTkxMjY3NH0.xDw5kwPujGeB0_PcxGxJ-HRXWkGayN3PkS-ejZyVe1g'
const supa = supabase.createClient(supabaseUrl, supabaseKey, {
    auth: {
        redirectTo: window.location.origin,  // This will redirect back to the page where the request originated from
    },
});

export { supa }