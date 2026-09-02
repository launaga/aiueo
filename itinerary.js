(() => {
  const root = document.querySelector('[data-itinerary]');
  if (!root) return;
  const itinerary = [
    { id: ['Hari 1', 'Titik kumpul → destinasi', 'Pagi', 'Kedatangan dan perjalanan', 'Jam pasti, titik jemput, dan durasi disesuaikan setelah brief.'], en: ['Day 1', 'Meeting point → destination', 'Morning', 'Arrival and journey', 'Exact timing, pickup points, and duration are agreed after the brief.'], markers: ['transport'] },
    { id: ['Hari 1', 'Destinasi', 'Menjelang siang', 'Orientasi dan pembukaan', 'Brief keselamatan, pembagian kelompok, dan penyelarasan tujuan.'], en: ['Day 1', 'Destination', 'Late morning', 'Orientation and opening', 'Safety briefing, group setup, and a clear shared purpose.'], markers: ['meal'] },
    { id: ['Hari 1', 'Area aktivitas', 'Siang', 'Program utama', 'Intensitas, aksesibilitas, dan alternatif cuaca mengikuti profil peserta.'], en: ['Day 1', 'Activity area', 'Afternoon', 'Main program', 'Intensity, accessibility, and weather alternatives follow the participant profile.'], markers: ['activity', 'meal'] },
    { id: ['Hari 1', 'Area penutup', 'Sore', 'Refleksi dan perjalanan pulang', 'Penutup singkat untuk membawa cerita lapangan kembali ke pekerjaan.'], en: ['Day 1', 'Closing area', 'Late afternoon', 'Reflection and return journey', 'A short close helps carry the field experience back into the way the team works.'], markers: ['transport'] }
  ];
  const labels = { transport: ['Transport', 'Bus'], meal: ['Makan', 'Meal'], activity: ['Aktivitas', 'Activity'] };
  const render = () => {
    const language = document.documentElement.lang;
    root.innerHTML = itinerary.map((item) => {
      const [day, place, time, activity, notes] = item[language === 'id' ? 'id' : 'en'];
      return `<article class="itinerary-item">
      <div class="itinerary-time"><span>${day}</span><strong>${time}</strong></div>
      <div class="itinerary-content"><p>${place}</p><h3>${activity}</h3><div class="itinerary-markers">${item.markers.map((marker) => `<span data-marker="${marker}">${labels[marker][language === 'id' ? 0 : 1]}</span>`).join('')}</div><p>${notes}</p></div>
    </article>`;
    }).join('');
  };
  render();
  document.querySelectorAll('[data-language]').forEach((button) => button.addEventListener('click', () => requestAnimationFrame(render)));
})();
