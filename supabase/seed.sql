-- =========================================
-- SEED: prompt contoh (tema poster AI)
-- Jalankan SEKALI di Supabase > SQL Editor > Run
-- Selamat dijalankan berulang (skip kalau tajuk dah wujud)
-- =========================================

insert into prompts
  (owner_id, title, description, body, tags, variables, visibility, created_at, updated_at)
select
  u.id, v.title, v.description, v.body, v.tags, '{}'::text[], 'private',
  now() - (v.days::text || ' days')::interval,
  now() - (v.days::text || ' days')::interval
from auth.users u
cross join (values
  ('Gundam Pilot Profile Aesthetic', 'Watak pilot terperinci', 'Highly detailed character profile poster of a {pilot_name} Gundam pilot, {mood} expression, cockpit background, cinematic lighting, 4k', array['Gundam','Character','Aesthetic'], 0),
  ('Cyberpunk Neon Night Market Scene', 'Suasana pasar malam', 'Atmospheric {city} cyberpunk night market, neon signs, rain reflections, crowd silhouettes, volumetric light, ultra detailed', array['Cyberpunk','Aesthetic'], 0),
  ('Robot Evolution Concept Art', 'Progresi reka bentuk robot', 'Step by step concept art showing evolution of a {type} robot from sketch to final render, industrial design sheet', array['Robot','Concept Art'], 1),
  ('Sci-Fi Fleet Engagement Strategy', 'Pertempuran angkasa', 'Tactical wide shot of a sci-fi space fleet engagement near {planet}, capital ships, laser fire, debris, dramatic scale', array['Sci-Fi','Space'], 1),
  ('Cyberpunk Hovercar Chase', 'Aksi laju', 'Dynamic {time} hovercar chase through a cyberpunk megacity canyon, motion blur, neon trails, cinematic angle', array['Cyberpunk','Sci-Fi'], 2),
  ('Character Arcs Luna', 'Latar watak utama', 'Key motivations and origin story sheet for {character}, expressive portrait, mood board, soft rim light', array['Character','Narrative'], 2),
  ('Gundam Cockpit POV', 'Pandangan kokpit', 'First person cockpit POV inside a {model} Gundam, glowing HUD, hands on controls, intense battle outside', array['Gundam','Sci-Fi'], 3),
  ('Minimalist Spaceship Hull Design', 'Reka bentuk bersih', 'Clean minimalist {class} spaceship hull design, matte panels, studio lighting, product render style', array['Minimalist','Space','Future-Tech'], 3),
  ('Robot Companion Character Sheet', 'Helai watak robot', 'Friendly {size} robot companion character sheet, multiple angles, color callouts, soft studio background', array['Robot','Character'], 5),
  ('Mecha Hangar Wide Shot', 'Hangar mecha', 'Massive mecha hangar wide shot with {count} units under maintenance, sparks, cables, atmospheric haze', array['Gundam','Robot','Concept Art'], 6),
  ('Fantasy Sky Citadel Matte Painting', 'Lukisan matte', 'Epic floating sky citadel above {landscape}, golden hour, matte painting, sweeping clouds, fantasy scale', array['Fantasy','Concept Art'], 8),
  ('Mythology Reimagined Poster', 'Siri poster mitos', 'Modern reimagined poster of the {deity} mythology figure, bold typography space, dramatic lighting', array['Mythology','Aesthetic'], 10),
  ('Future-Tech HUD Overlay', 'Overlay antara muka', 'Sleek future-tech HUD overlay for a {device}, holographic elements, thin lines, dark UI aesthetic', array['Future-Tech','Minimalist'], 12),
  ('Deep Space Nebula Wallpaper', 'Kertas dinding nebula', 'Ultra wide deep space {color} nebula wallpaper, stars, gas clouds, high dynamic range, 8k', array['Space','Aesthetic'], 14)
) as v(title, description, body, tags, days)
where not exists (
  select 1 from prompts pp where pp.owner_id = u.id and pp.title = v.title
);
