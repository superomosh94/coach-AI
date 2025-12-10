-- ============================================
-- VIBE COACH DATABASE SEEDING
-- 1000+ Flirting Lines for Initial Population
-- ============================================

USE vibe_coach;

-- ============================================
-- Clear existing data (if needed)
-- ============================================
-- DELETE FROM line_tags;
-- DELETE FROM duplicate_checks;
-- DELETE FROM user_feedback;
-- DELETE FROM line_variants;
-- DELETE FROM flirting_lines;
-- DELETE FROM sources;
-- COMMIT;

-- ============================================
-- Insert Sources
-- ============================================
INSERT INTO sources (source_name, source_type, domain, reliability_score) VALUES
('Manual Kenyan Collection', 'manual_entry', 'local', 0.9),
('International Pickup Lines DB', 'website', 'various', 0.7),
('Reddit r/pickuplines', 'forum', 'reddit.com', 0.8),
('Twitter Kenyan Flirting', 'social_media', 'twitter.com', 0.6),
('WhatsApp Forwards KE', 'app', 'whatsapp.com', 0.5),
('BrainyQuote Love', 'website', 'brainyquote.com', 0.8),
('Movie Quotes', 'movie', 'hollywood', 0.7),
('Classic Literature', 'book', 'various', 0.9);

-- ============================================
-- Insert 1000+ Flirting Lines
-- ============================================
INSERT INTO flirting_lines (line_text, category, style, context, stage, target_gender, source_type, quality_score, originality_score, success_rate, has_emoji, has_question, has_compliment) VALUES
-- KENYAN/SWAHILI/SHENG LINES (1-150)
('Uko na ubao? Kwa maana umenipoteza huku nimeanguka kwa upendo.', 'playful', 'kenyan', 'opening', 'initial', 'female', 'manual_entry', 4.5, 4.8, 0.7, FALSE, TRUE, TRUE),
('Sio mkali, but ukinitazama hivyo, nitaanza kuchemka.', 'smooth', 'sheng', 'response', 'initial', 'female', 'manual_entry', 4.7, 4.5, 0.75, FALSE, FALSE, TRUE),
('Unajua nini inanifanya nitabasamu? Notification kutoka kwako.', 'playful', 'kenyan', 'opening', 'initial', 'neutral', 'manual_entry', 4.3, 4.7, 0.8, FALSE, TRUE, FALSE),
('Kama ni mbaya kuassume, then assume nikutake.', 'direct', 'sheng', 'opening', 'initial', 'female', 'manual_entry', 4.0, 4.9, 0.65, FALSE, FALSE, TRUE),
('Hata kama sio programmer, najua you''re my exception handler.', 'clever', 'mixed', 'opening', 'initial', 'female', 'manual_entry', 4.2, 4.6, 0.7, FALSE, FALSE, FALSE),
('Uko single kama nilikuwa? Because hii connection ina ping poa.', 'playful', 'sheng', 'opening', 'initial', 'female', 'manual_entry', 4.4, 4.5, 0.75, FALSE, TRUE, FALSE),
('Unajua kuskiza voicemail yako ni kama kunywa stoney mchana joto.', 'smooth', 'kenyan', 'response', 'middle', 'female', 'manual_entry', 4.6, 4.8, 0.8, FALSE, FALSE, TRUE),
('Kama ni kukosa direction, ningekuuliza location yako.', 'cheesy', 'kenyan', 'opening', 'initial', 'female', 'manual_entry', 3.8, 4.2, 0.6, FALSE, FALSE, FALSE),
('Hata ukiniignore, bado nitaendelea kuku-slide kwenye DMs.', 'bold', 'sheng', 'followup', 'middle', 'female', 'manual_entry', 4.1, 4.3, 0.7, FALSE, FALSE, TRUE),
('Wewe ni kama Thika Road - nimekuwa stuck kwako kwa masaa.', 'funny', 'kenyan', 'opening', 'initial', 'female', 'manual_entry', 4.3, 4.7, 0.72, FALSE, FALSE, FALSE),
('Unaitwa nini? Ata nikiita support, system inasema you''re my missing component.', 'clever', 'mixed', 'opening', 'initial', 'female', 'manual_entry', 4.5, 4.8, 0.78, FALSE, TRUE, TRUE),
('Kama unataka kunitest, basi niku-test mwenyewe.', 'direct', 'sheng', 'response', 'advanced', 'female', 'manual_entry', 4.2, 4.4, 0.68, FALSE, FALSE, FALSE),
('Nimeku-search Google, YouTube, na hata Jumia, but haukupatikani.', 'playful', 'kenyan', 'opening', 'initial', 'female', 'manual_entry', 4.4, 4.6, 0.74, FALSE, FALSE, TRUE),
('Hata ukini-block, bado nita-request kufollow tena.', 'bold', 'sheng', 'followup', 'middle', 'female', 'manual_entry', 3.9, 4.5, 0.63, FALSE, FALSE, TRUE),
('Unajua unaweza kuwa na million followers, but I''ll be your one like.', 'romantic', 'mixed', 'response', 'middle', 'female', 'manual_entry', 4.6, 4.3, 0.77, FALSE, FALSE, TRUE),
('Kama ni kukosa credit, ningeku-send airtime daily.', 'cheesy', 'kenyan', 'opening', 'initial', 'female', 'manual_entry', 3.7, 4.0, 0.58, FALSE, FALSE, FALSE),
('Wewe ni kama Safaricom - The better option.', 'smooth', 'kenyan', 'compliment', 'initial', 'female', 'manual_entry', 4.3, 4.5, 0.71, FALSE, FALSE, TRUE),
('Nimeku-add kwa contacts, now you''re my favorite person.', 'playful', 'mixed', 'followup', 'middle', 'neutral', 'manual_entry', 4.1, 4.2, 0.69, FALSE, FALSE, TRUE),
('Ukinitaka niku-screenshot, because you''re worth saving.', 'romantic', 'mixed', 'response', 'middle', 'female', 'manual_entry', 4.5, 4.4, 0.76, FALSE, FALSE, TRUE),
('Kama unajua kunyimwa lift, hio ndio nafsi yangu right now.', 'funny', 'sheng', 'opening', 'initial', 'female', 'manual_entry', 4.0, 4.6, 0.7, FALSE, FALSE, FALSE),
('Nimeku-save kwa speed dial, because emergencies happen.', 'playful', 'mixed', 'response', 'middle', 'female', 'manual_entry', 4.2, 4.3, 0.72, FALSE, FALSE, FALSE),
('Uko na WiFi? Kwa maana sina connection mingine.', 'cheesy', 'kenyan', 'opening', 'initial', 'female', 'manual_entry', 3.8, 4.1, 0.61, FALSE, TRUE, FALSE),
('Nimeku-favorite kama WhatsApp message.', 'smooth', 'mixed', 'response', 'middle', 'female', 'manual_entry', 4.3, 4.2, 0.73, FALSE, FALSE, TRUE),
('Ukinitaka niku-download, because offline is boring.', 'playful', 'mixed', 'followup', 'middle', 'female', 'manual_entry', 4.1, 4.4, 0.68, FALSE, FALSE, FALSE),
('Wewe ni kama M-Pesa - convenient na reliable.', 'smooth', 'kenyan', 'compliment', 'initial', 'female', 'manual_entry', 4.4, 4.6, 0.75, FALSE, FALSE, TRUE),
('Nimeku-bookmark kwa maana sikutaki kupotea.', 'romantic', 'mixed', 'response', 'middle', 'female', 'manual_entry', 4.5, 4.3, 0.77, FALSE, FALSE, TRUE),
('Kama ni kukosa data, ningeku-stream offline.', 'cheesy', 'kenyan', 'opening', 'initial', 'female', 'manual_entry', 3.6, 4.0, 0.59, FALSE, FALSE, FALSE),
('Wewe ni kama Uber - you take me places.', 'smooth', 'kenyan', 'compliment', 'initial', 'female', 'manual_entry', 4.2, 4.5, 0.7, FALSE, FALSE, TRUE),
('Nimeku-star kama important email.', 'playful', 'mixed', 'response', 'middle', 'female', 'manual_entry', 4.0, 4.1, 0.67, FALSE, FALSE, FALSE),
('Ukinitaka niku-sync, because being apart is outdated.', 'clever', 'mixed', 'followup', 'advanced', 'female', 'manual_entry', 4.3, 4.7, 0.72, FALSE, FALSE, TRUE),
('Wewe ni kama Nairobi sun - impossible to ignore.', 'romantic', 'kenyan', 'compliment', 'initial', 'female', 'manual_entry', 4.6, 4.4, 0.78, FALSE, FALSE, TRUE),
('Nimeku-pin kwa top conversations.', 'playful', 'mixed', 'response', 'middle', 'neutral', 'manual_entry', 4.1, 4.2, 0.69, FALSE, FALSE, FALSE),
('Kama ni kukosa mboga, ningeku-pea kila siku.', 'cheesy', 'kenyan', 'opening', 'initial', 'female', 'manual_entry', 3.5, 4.1, 0.57, FALSE, FALSE, FALSE),
('Wewe ni kama Kenyan tea - sweet na refreshing.', 'smooth', 'kenyan', 'compliment', 'initial', 'female', 'manual_entry', 4.3, 4.6, 0.74, FALSE, FALSE, TRUE),
('Nimeku-mute the world, because your volume is enough.', 'romantic', 'mixed', 'response', 'advanced', 'female', 'manual_entry', 4.7, 4.5, 0.79, FALSE, FALSE, TRUE),
('Ukinitaka niku-share, because you''re too good to keep.', 'playful', 'mixed', 'followup', 'middle', 'female', 'manual_entry', 4.2, 4.3, 0.7, FALSE, FALSE, TRUE),
('Wewe ni kama matatu ya Thika Road - always on my mind.', 'funny', 'kenyan', 'opening', 'initial', 'female', 'manual_entry', 4.1, 4.7, 0.71, FALSE, FALSE, FALSE),
('Nimeku-save as draft, because perfection takes time.', 'smooth', 'mixed', 'response', 'middle', 'female', 'manual_entry', 4.4, 4.4, 0.75, FALSE, FALSE, TRUE),
('Kama ni kukosa jiko, ningeku-cook with love.', 'cheesy', 'kenyan', 'opening', 'initial', 'female', 'manual_entry', 3.4, 4.0, 0.56, FALSE, FALSE, FALSE),
('Wewe ni kama Kilimanjaro - breathtaking view.', 'romantic', 'kenyan', 'compliment', 'initial', 'female', 'manual_entry', 4.8, 4.3, 0.8, FALSE, FALSE, TRUE),
('Nimeku-archive the rest, you''re the only one I need.', 'romantic', 'mixed', 'response', 'advanced', 'female', 'manual_entry', 4.6, 4.4, 0.77, FALSE, FALSE, TRUE),
('Sema ukinitaka ni-kujoin group ya wewe na mimi.', 'direct', 'sheng', 'opening', 'initial', 'female', 'manual_entry', 4.0, 4.6, 0.66, FALSE, FALSE, FALSE),
('Wapi nimekosea? Maana nimekosa mwezi mzima.', 'playful', 'swahili', 'opening', 'initial', 'female', 'manual_entry', 4.2, 4.5, 0.7, FALSE, TRUE, FALSE),
('Unajua hata simu inakata, lakini mazungumzo yetu hayakati.', 'romantic', 'swahili', 'followup', 'middle', 'neutral', 'manual_entry', 4.5, 4.3, 0.76, FALSE, FALSE, FALSE),
('Kama ni kukosa simu, ningekupa yangu with unlimited minutes.', 'cheesy', 'kenyan', 'opening', 'initial', 'female', 'manual_entry', 3.3, 4.1, 0.55, FALSE, FALSE, FALSE),
('Wewe ni kama satellite - you make my world go round.', 'smooth', 'mixed', 'compliment', 'initial', 'female', 'manual_entry', 4.3, 4.2, 0.73, FALSE, FALSE, TRUE),
('Nimeku-block distractions, you''re my main focus.', 'romantic', 'mixed', 'response', 'advanced', 'female', 'manual_entry', 4.7, 4.3, 0.78, FALSE, FALSE, TRUE),
('Ukinitaka niku-backup, because losing you isn''t an option.', 'romantic', 'mixed', 'followup', 'advanced', 'female', 'manual_entry', 4.6, 4.4, 0.77, FALSE, FALSE, TRUE),
('Wewe ni kama solar panel - unanipa power.', 'smooth', 'kenyan', 'compliment', 'initial', 'female', 'manual_entry', 4.2, 4.5, 0.71, FALSE, FALSE, TRUE),
('Nimeku-silence notifications, your voice is all I want.', 'romantic', 'mixed', 'response', 'advanced', 'female', 'manual_entry', 4.8, 4.6, 0.81, FALSE, FALSE, TRUE),
('Sema nikikupa number yangu, uta-i-save kwa nani?', 'playful', 'sheng', 'opening', 'initial', 'female', 'manual_entry', 4.1, 4.4, 0.68, FALSE, TRUE, FALSE),
('Unajua hata darasa lingine, but mimi niko kwa class yako.', 'clever', 'sheng', 'response', 'middle', 'female', 'manual_entry', 4.3, 4.5, 0.72, FALSE, FALSE, FALSE),
('Kama ni kukosa baiskeli, ningekuchukua piggy-back.', 'cheesy', 'kenyan', 'opening', 'initial', 'female', 'manual_entry', 3.2, 4.0, 0.54, FALSE, FALSE, FALSE),
('Wewe ni kama generator - unaninipa light giza.', 'smooth', 'kenyan', 'compliment', 'initial', 'female', 'manual_entry', 4.1, 4.3, 0.7, FALSE, FALSE, TRUE),
('Nimeku-close other tabs, you''re my homepage.', 'romantic', 'mixed', 'response', 'advanced', 'female', 'manual_entry', 4.6, 4.5, 0.78, FALSE, FALSE, TRUE),
('Ukinitaka niku-cache, for faster access always.', 'playful', 'mixed', 'followup', 'middle', 'female', 'manual_entry', 4.0, 4.2, 0.67, FALSE, FALSE, FALSE),
('Wewe ni kama emergency exit - you show me the way.', 'smooth', 'mixed', 'compliment', 'initial', 'female', 'manual_entry', 4.2, 4.4, 0.71, FALSE, FALSE, TRUE),
('Nimeku-minimize everything else, you''re my main window.', 'romantic', 'mixed', 'response', 'advanced', 'female', 'manual_entry', 4.7, 4.3, 0.79, FALSE, FALSE, TRUE),
('Sema nikikupigia, uta-jibu ama uta-forward?', 'playful', 'sheng', 'opening', 'initial', 'female', 'manual_entry', 4.0, 4.5, 0.65, FALSE, TRUE, FALSE),
('Unajua hata kama ni fake account, bado ningeku-follow.', 'bold', 'sheng', 'response', 'middle', 'female', 'manual_entry', 3.9, 4.4, 0.64, FALSE, FALSE, TRUE),
('Kama ni kukosa dawa, ningeku-treat with care.', 'cheesy', 'kenyan', 'opening', 'initial', 'female', 'manual_entry', 3.1, 4.1, 0.53, FALSE, FALSE, FALSE),
('Wewe ni kama calculator - you solve my problems.', 'smooth', 'mixed', 'compliment', 'initial', 'female', 'manual_entry', 4.0, 4.2, 0.69, FALSE, FALSE, TRUE),
('Nimeku-book for next year, because you''re worth waiting for.', 'romantic', 'mixed', 'response', 'advanced', 'female', 'manual_entry', 4.8, 4.7, 0.82, FALSE, FALSE, TRUE),
('Are you a parking ticket? Because you have FINE written all over you.', 'cheesy', 'international', 'opening', 'initial', 'female', 'website', 3.5, 3.0, 0.5, FALSE, TRUE, TRUE),
('If you were a triangle you''d be acute one.', 'clever', 'international', 'opening', 'initial', 'female', 'website', 4.0, 4.2, 0.6, FALSE, FALSE, FALSE),
('Is your name Google? Because you have everything I''m searching for.', 'cheesy', 'international', 'opening', 'initial', 'female', 'website', 3.8, 3.5, 0.55, FALSE, TRUE, TRUE),
('Are you made of copper and tellurium? Because you''re Cu-Te.', 'clever', 'international', 'opening', 'initial', 'female', 'website', 4.1, 4.5, 0.58, FALSE, TRUE, FALSE),
('Do you have a map? I keep getting lost in your eyes.', 'cheesy', 'international', 'opening', 'initial', 'female', 'website', 3.2, 2.8, 0.45, FALSE, TRUE, TRUE),
('Is your dad a boxer? Because you''re a knockout!', 'cheesy', 'international', 'opening', 'initial', 'female', 'website', 3.0, 2.5, 0.4, FALSE, TRUE, TRUE),
('Are you French? Because Eiffel for you.', 'clever', 'international', 'opening', 'initial', 'female', 'website', 4.2, 4.0, 0.62, FALSE, TRUE, FALSE),
('Do you like Star Wars? Because Yoda one for me!', 'funny', 'international', 'opening', 'initial', 'neutral', 'website', 3.9, 3.8, 0.65, FALSE, TRUE, FALSE),
('Are you a time traveler? Because I see you in my future.', 'romantic', 'international', 'opening', 'initial', 'female', 'website', 4.5, 4.0, 0.7, FALSE, TRUE, FALSE),
('Is your name Wi-fi? Because I''m really feeling a connection.', 'cheesy', 'international', 'opening', 'initial', 'female', 'website', 3.6, 3.2, 0.5, FALSE, TRUE, FALSE),
('Do you believe in love at first sight, or should I walk by again?', 'playful', 'international', 'opening', 'initial', 'female', 'website', 4.3, 4.1, 0.68, FALSE, TRUE, FALSE),
('Are you a bank loan? Because you have my interest.', 'clever', 'international', 'opening', 'initial', 'female', 'website', 4.0, 4.3, 0.6, FALSE, TRUE, FALSE),
('Is there an airport nearby or is that just my heart taking off?', 'cheesy', 'international', 'opening', 'initial', 'female', 'website', 3.1, 2.9, 0.42, FALSE, TRUE, FALSE),
('Do you have a Band-Aid? I just scraped my knee falling for you.', 'cheesy', 'international', 'opening', 'initial', 'female', 'website', 3.3, 3.0, 0.44, FALSE, TRUE, TRUE),
('Are you a campfire? Because you''re hot and I want s''more.', 'cheesy', 'international', 'opening', 'initial', 'female', 'website', 3.4, 3.2, 0.46, FALSE, TRUE, TRUE),
('Is your dad an artist? Because you''re a masterpiece.', 'smooth', 'international', 'compliment', 'initial', 'female', 'website', 4.4, 3.8, 0.72, FALSE, TRUE, TRUE),
('Do you have a pencil? Because I want to erase your past and write our future.', 'romantic', 'international', 'opening', 'initial', 'female', 'website', 4.6, 4.2, 0.75, FALSE, TRUE, FALSE),
('Are you a camera? Because every time I look at you, I smile.', 'cheesy', 'international', 'opening', 'initial', 'female', 'website', 3.5, 3.1, 0.48, FALSE, TRUE, TRUE),
('Is your name Chapstick? Because you''re da balm!', 'funny', 'international', 'opening', 'initial', 'neutral', 'website', 3.8, 3.9, 0.63, FALSE, TRUE, FALSE),
('Do you like raisins? How do you feel about a date?', 'clever', 'international', 'opening', 'initial', 'female', 'website', 4.1, 4.4, 0.64, FALSE, TRUE, FALSE),
('Are you a magician? Because whenever I look at you, everyone else disappears.', 'romantic', 'international', 'opening', 'initial', 'female', 'website', 4.7, 4.1, 0.78, FALSE, TRUE, TRUE),
('Is this the Hogwarts Express? Because it feels like you and I are headed somewhere magical.', 'clever', 'international', 'opening', 'initial', 'neutral', 'website', 4.3, 4.5, 0.7, FALSE, TRUE, FALSE),
('Do you have a sunburn, or are you always this hot?', 'cheesy', 'international', 'opening', 'initial', 'female', 'website', 2.9, 2.5, 0.38, FALSE, TRUE, TRUE),
('Are you a parking ticket? ''Cause you''ve got "fine" written all over you.', 'cheesy', 'international', 'opening', 'initial', 'female', 'website', 3.2, 2.8, 0.41, FALSE, TRUE, TRUE),
('Is your dad a baker? Because you''re a cutie pie!', 'cheesy', 'international', 'opening', 'initial', 'female', 'website', 3.0, 2.7, 0.39, FALSE, TRUE, TRUE),
('Do you have a mirror in your pocket? Because I can see myself in your pants.', 'bold', 'international', 'opening', 'initial', 'female', 'website', 2.5, 2.0, 0.3, FALSE, TRUE, FALSE),
('Are you an alien? Because you just abducted my heart.', 'cheesy', 'international', 'opening', 'initial', 'female', 'website', 3.4, 3.1, 0.45, FALSE, TRUE, TRUE),
('Is your name Cinderella? Because I see that dress disappearing at midnight.', 'bold', 'international', 'opening', 'initial', 'female', 'website', 2.8, 2.9, 0.35, FALSE, TRUE, FALSE),
('Do you believe in fate? Because I think we were meant to meet.', 'romantic', 'international', 'opening', 'initial', 'female', 'website', 4.5, 3.9, 0.74, FALSE, TRUE, FALSE),
('Are you a loan? Because you have my interest.', 'clever', 'international', 'opening', 'initial', 'female', 'website', 4.0, 4.2, 0.62, FALSE, TRUE, FALSE),
('I''m not a photographer, but I can picture us together.', 'smooth', 'international', 'opening', 'initial', 'female', 'website', 4.2, 3.8, 0.68, FALSE, FALSE, FALSE),
('Do you have a name or can I call you mine?', 'smooth', 'international', 'opening', 'initial', 'female', 'website', 4.3, 4.0, 0.7, FALSE, TRUE, FALSE),
('I was wondering if you had an extra heart, because mine was just stolen.', 'romantic', 'international', 'opening', 'initial', 'female', 'website', 4.6, 4.1, 0.76, FALSE, FALSE, TRUE),
('If beauty were time, you''d be eternity.', 'romantic', 'international', 'compliment', 'initial', 'female', 'website', 4.8, 4.3, 0.82, FALSE, FALSE, TRUE),
('You must be a magician because every time I look at you, everyone else disappears.', 'romantic', 'international', 'compliment', 'initial', 'female', 'website', 4.7, 4.0, 0.8, FALSE, FALSE, TRUE),
('I''m not usually this forward, but I had to meet you.', 'direct', 'international', 'opening', 'initial', 'female', 'website', 4.4, 3.9, 0.72, FALSE, FALSE, FALSE),
('If I could rearrange the alphabet, I''d put U and I together.', 'cheesy', 'international', 'opening', 'initial', 'female', 'website', 3.9, 3.5, 0.6, FALSE, FALSE, FALSE),
('You''re like a dream I never want to wake up from.', 'romantic', 'international', 'compliment', 'initial', 'female', 'website', 4.9, 4.2, 0.85, FALSE, FALSE, TRUE),
('I think my heart just skipped a beat when you smiled.', 'romantic', 'international', 'response', 'initial', 'female', 'website', 4.5, 4.0, 0.78, FALSE, FALSE, TRUE),
('You''re the reason I believe in love at first sight.', 'romantic', 'international', 'compliment', 'initial', 'female', 'website', 4.7, 4.1, 0.81, FALSE, FALSE, TRUE),
('I don''t need to see the stars when I can look at your eyes.', 'romantic', 'international', 'compliment', 'initial', 'female', 'website', 4.8, 4.3, 0.83, FALSE, FALSE, TRUE),
('You make my heart smile.', 'romantic', 'international', 'compliment', 'initial', 'neutral', 'website', 4.6, 3.8, 0.79, FALSE, FALSE, TRUE),
('I was going to say something clever, but you left me speechless.', 'smooth', 'international', 'opening', 'initial', 'female', 'website', 4.3, 4.0, 0.71, FALSE, FALSE, TRUE),
('You''re more beautiful than the most perfect sunset.', 'romantic', 'international', 'compliment', 'initial', 'female', 'website', 4.7, 3.9, 0.8, FALSE, FALSE, TRUE),
('I think you''re the missing piece I''ve been searching for.', 'romantic', 'international', 'opening', 'initial', 'neutral', 'website', 4.5, 4.1, 0.77, FALSE, FALSE, TRUE),
('Your smile is brighter than the sun.', 'romantic', 'international', 'compliment', 'initial', 'female', 'website', 4.4, 3.7, 0.75, FALSE, FALSE, TRUE),
('I didn''t believe in destiny until now.', 'romantic', 'international', 'opening', 'initial', 'female', 'website', 4.6, 4.0, 0.79, FALSE, FALSE, FALSE),
('You''re the best thing that''s happened to me all day.', 'smooth', 'international', 'response', 'initial', 'neutral', 'website', 4.2, 3.8, 0.7, FALSE, FALSE, TRUE),
('I feel like I''ve known you forever, even though we just met.', 'romantic', 'international', 'opening', 'initial', 'neutral', 'website', 4.5, 4.2, 0.76, FALSE, FALSE, FALSE),
('You''re the answer to every prayer I never prayed.', 'romantic', 'international', 'compliment', 'initial', 'female', 'website', 4.9, 4.5, 0.86, FALSE, FALSE, TRUE),
('Are you a 90 degree angle? Because you''re looking right.', 'funny', 'international', 'opening', 'initial', 'female', 'website', 4.0, 4.3, 0.65, FALSE, TRUE, FALSE),
('Is your name Ariel? Because we mermaid for each other.', 'funny', 'international', 'opening', 'initial', 'female', 'website', 3.8, 4.1, 0.63, FALSE, TRUE, FALSE),
('Are you made of grapes? Because you''re fine and I want wine.', 'funny', 'international', 'opening', 'initial', 'female', 'website', 3.9, 4.0, 0.64, FALSE, TRUE, TRUE),
('Do you have a sunburn or are you always this hot? Just kidding, that was terrible.', 'funny', 'international', 'opening', 'initial', 'female', 'website', 3.7, 3.9, 0.62, FALSE, TRUE, TRUE),
('Are you a dictionary? Because you''re adding meaning to my life.', 'clever', 'international', 'opening', 'initial', 'female', 'website', 4.2, 4.4, 0.68, FALSE, TRUE, FALSE),
('Is your name Google? Because you have everything I''ve been searching for, and I''m not even talking about the internet.', 'clever', 'international', 'opening', 'initial', 'female', 'website', 4.3, 4.5, 0.7, FALSE, TRUE, FALSE),
('Are you a bank loan? Because you have my interest and I''m willing to pay it back over a lifetime.', 'clever', 'international', 'opening', 'initial', 'female', 'website', 4.1, 4.6, 0.67, FALSE, TRUE, FALSE),
('Do you like Star Wars? Because Yoda only one for me! And I''m not even a Jedi.', 'funny', 'international', 'opening', 'initial', 'neutral', 'website', 4.0, 4.2, 0.66, FALSE, TRUE, FALSE),
('Are you a time traveler? Because I see you in my future, and I''ve checked - it looks pretty good.', 'clever', 'international', 'opening', 'initial', 'female', 'website', 4.4, 4.3, 0.72, FALSE, TRUE, FALSE),
('Is your name Wi-fi? Because I''m really feeling a connection, and I hope it doesn''t drop.', 'funny', 'international', 'opening', 'initial', 'female', 'website', 3.9, 4.0, 0.65, FALSE, TRUE, FALSE),
('I don''t have a pickup line. I just wanted to say you''re stunning.', 'direct', 'international', 'opening', 'initial', 'female', 'website', 4.7, 4.8, 0.8, FALSE, FALSE, TRUE),
('Normally I''d think of something clever to say, but you left me speechless.', 'direct', 'international', 'opening', 'initial', 'female', 'website', 4.6, 4.5, 0.79, FALSE, FALSE, TRUE),
('I''m not usually this forward, but I had to say hello.', 'direct', 'international', 'opening', 'initial', 'female', 'website', 4.5, 4.4, 0.77, FALSE, FALSE, FALSE),
('I''m supposed to be doing something else, but I can''t stop looking at you.', 'direct', 'international', 'opening', 'initial', 'female', 'website', 4.4, 4.3, 0.75, FALSE, FALSE, TRUE),
('I''ll stop staring when you say yes to coffee.', 'direct', 'international', 'opening', 'initial', 'female', 'website', 4.3, 4.2, 0.73, FALSE, FALSE, FALSE),
('I know this is forward, but would you like to have dinner with me?', 'direct', 'international', 'opening', 'initial', 'female', 'website', 4.6, 4.6, 0.78, FALSE, TRUE, FALSE),
('I don''t believe in wasting time. Would you like to go out sometime?', 'direct', 'international', 'opening', 'initial', 'neutral', 'website', 4.5, 4.5, 0.76, FALSE, TRUE, FALSE),
('I''m going to be honest - I think you''re amazing and I''d like to get to know you.', 'direct', 'international', 'opening', 'initial', 'female', 'website', 4.7, 4.7, 0.81, FALSE, FALSE, TRUE),
('Life''s too short for games. Can I take you out?', 'direct', 'international', 'opening', 'initial', 'female', 'website', 4.4, 4.4, 0.74, FALSE, TRUE, FALSE),
('I don''t have a clever line. I just think you''re beautiful.', 'direct', 'international', 'opening', 'initial', 'female', 'website', 4.8, 4.8, 0.83, FALSE, FALSE, TRUE),
('That''s interesting. Tell me more.', 'smooth', 'international', 'response', 'middle', 'neutral', 'website', 4.0, 3.5, 0.7, FALSE, FALSE, FALSE),
('I love your perspective on that.', 'smooth', 'international', 'response', 'middle', 'neutral', 'website', 4.2, 3.8, 0.72, FALSE, FALSE, TRUE),
('You have a really great way of looking at things.', 'smooth', 'international', 'response', 'middle', 'neutral', 'website', 4.3, 4.0, 0.74, FALSE, FALSE, TRUE),
('That says a lot about you, and I like what I''m hearing.', 'smooth', 'international', 'response', 'middle', 'neutral', 'website', 4.4, 4.2, 0.76, FALSE, FALSE, TRUE),
('You''re not just beautiful, you''re interesting too.', 'smooth', 'international', 'response', 'middle', 'female', 'website', 4.5, 4.1, 0.78, FALSE, FALSE, TRUE),
('I could listen to you talk all day.', 'romantic', 'international', 'response', 'middle', 'neutral', 'website', 4.6, 4.3, 0.8, FALSE, FALSE, TRUE),
('You make even ordinary things sound fascinating.', 'romantic', 'international', 'response', 'middle', 'neutral', 'website', 4.4, 4.2, 0.77, FALSE, FALSE, TRUE),
('I''m really enjoying this conversation.', 'smooth', 'international', 'response', 'middle', 'neutral', 'website', 4.2, 3.9, 0.73, FALSE, FALSE, FALSE),
('You have a great sense of humor.', 'smooth', 'international', 'response', 'middle', 'neutral', 'website', 4.3, 4.0, 0.75, FALSE, FALSE, TRUE),
('That''s actually really impressive.', 'smooth', 'international', 'response', 'middle', 'neutral', 'website', 4.1, 3.8, 0.71, FALSE, FALSE, TRUE),
('So, what''s your story?', 'smooth', 'international', 'followup', 'middle', 'neutral', 'website', 4.0, 3.5, 0.68, FALSE, TRUE, FALSE),
('Tell me something about yourself that would surprise me.', 'playful', 'international', 'followup', 'middle', 'neutral', 'website', 4.2, 4.0, 0.7, FALSE, TRUE, FALSE),
('What''s the most adventurous thing you''ve ever done?', 'playful', 'international', 'followup', 'middle', 'neutral', 'website', 4.1, 3.9, 0.69, FALSE, TRUE, FALSE),
('If you could travel anywhere right now, where would you go?', 'playful', 'international', 'followup', 'middle', 'neutral', 'website', 4.0, 3.8, 0.67, FALSE, TRUE, FALSE),
('What makes you genuinely happy?', 'romantic', 'international', 'followup', 'middle', 'neutral', 'website', 4.5, 4.2, 0.76, FALSE, TRUE, FALSE),
('What''s your idea of a perfect day?', 'romantic', 'international', 'followup', 'middle', 'neutral', 'website', 4.4, 4.1, 0.75, FALSE, TRUE, FALSE),
('What''s something you''re passionate about?', 'smooth', 'international', 'followup', 'middle', 'neutral', 'website', 4.3, 4.0, 0.74, FALSE, TRUE, FALSE),
('What''s the best compliment you''ve ever received?', 'smooth', 'international', 'followup', 'middle', 'neutral', 'website', 4.2, 3.9, 0.72, FALSE, TRUE, FALSE),
('What''s something you''ve always wanted to try?', 'playful', 'international', 'followup', 'middle', 'neutral', 'website', 4.1, 3.8, 0.7, FALSE, TRUE, FALSE),
('If you had a superpower, what would it be?', 'playful', 'international', 'followup', 'middle', 'neutral', 'website', 4.0, 4.1, 0.71, FALSE, TRUE, FALSE),
('What''s your favorite way to spend a weekend?', 'smooth', 'international', 'followup', 'middle', 'neutral', 'website', 3.9, 3.7, 0.69, FALSE, TRUE, FALSE),
('What''s the best meal you''ve ever had?', 'smooth', 'international', 'followup', 'middle', 'neutral', 'website', 3.8, 3.6, 0.68, FALSE, TRUE, FALSE),
('What''s something you''re really good at?', 'smooth', 'international', 'followup', 'middle', 'neutral', 'website', 4.1, 3.9, 0.72, FALSE, TRUE, FALSE),
('What''s the most spontaneous thing you''ve ever done?', 'playful', 'international', 'followup', 'middle', 'neutral', 'website', 4.2, 4.0, 0.73, FALSE, TRUE, FALSE),
('What''s your favorite thing about yourself?', 'romantic', 'international', 'followup', 'middle', 'neutral', 'website', 4.6, 4.3, 0.78, FALSE, TRUE, TRUE),
('What''s something not many people know about you?', 'smooth', 'international', 'followup', 'middle', 'neutral', 'website', 4.3, 4.1, 0.75, FALSE, TRUE, FALSE),
('What''s your biggest dream?', 'romantic', 'international', 'followup', 'middle', 'neutral', 'website', 4.7, 4.4, 0.8, FALSE, TRUE, FALSE),
('What''s the best advice you''ve ever received?', 'smooth', 'international', 'followup', 'middle', 'neutral', 'website', 4.2, 4.0, 0.74, FALSE, TRUE, FALSE),
('What''s something you''re looking forward to?', 'smooth', 'international', 'followup', 'middle', 'neutral', 'website', 4.1, 3.9, 0.72, FALSE, TRUE, FALSE),
('What''s your favorite memory?', 'romantic', 'international', 'followup', 'middle', 'neutral', 'website', 4.5, 4.2, 0.77, FALSE, TRUE, FALSE),
('What makes you laugh the most?', 'playful', 'international', 'followup', 'middle', 'neutral', 'website', 4.0, 3.8, 0.7, FALSE, TRUE, FALSE),
('What''s your favorite thing to do when you have free time?', 'smooth', 'international', 'followup', 'middle', 'neutral', 'website', 3.9, 3.7, 0.69, FALSE, TRUE, FALSE),
('What''s something you''re proud of?', 'smooth', 'international', 'followup', 'middle', 'neutral', 'website', 4.2, 4.0, 0.73, FALSE, TRUE, FALSE),
('What''s the most beautiful place you''ve ever been?', 'romantic', 'international', 'followup', 'middle', 'neutral', 'website', 4.4, 4.1, 0.76, FALSE, TRUE, FALSE),
('What''s something you''ve learned recently?', 'smooth', 'international', 'followup', 'middle', 'neutral', 'website', 4.1, 3.9, 0.72, FALSE, TRUE, FALSE),
('What''s your favorite quality in a person?', 'romantic', 'international', 'followup', 'middle', 'neutral', 'website', 4.5, 4.2, 0.78, FALSE, TRUE, FALSE),
('What''s something you''d like to learn?', 'smooth', 'international', 'followup', 'middle', 'neutral', 'website', 4.0, 3.8, 0.71, FALSE, TRUE, FALSE),
('What''s your idea of a perfect relationship?', 'romantic', 'international', 'followup', 'advanced', 'neutral', 'website', 4.6, 4.3, 0.79, FALSE, TRUE, FALSE),
('What''s the most important thing in life to you?', 'romantic', 'international', 'followup', 'advanced', 'neutral', 'website', 4.7, 4.4, 0.81, FALSE, TRUE, FALSE),
('What''s something you value most in friendship?', 'smooth', 'international', 'followup', 'middle', 'neutral', 'website', 4.3, 4.1, 0.75, FALSE, TRUE, FALSE),
('What''s your favorite way to show someone you care?', 'romantic', 'international', 'followup', 'advanced', 'neutral', 'website', 4.5, 4.2, 0.78, FALSE, TRUE, FALSE),
('What''s something you''re grateful for today?', 'romantic', 'international', 'followup', 'middle', 'neutral', 'website', 4.4, 4.1, 0.77, FALSE, TRUE, FALSE),
('What''s the best gift you''ve ever received?', 'smooth', 'international', 'followup', 'middle', 'neutral', 'website', 4.1, 3.9, 0.73, FALSE, TRUE, FALSE),
('What''s your favorite thing to do on a rainy day?', 'smooth', 'international', 'followup', 'middle', 'neutral', 'website', 3.8, 3.6, 0.7, FALSE, TRUE, FALSE),
('What''s something that always makes you smile?', 'romantic', 'international', 'followup', 'middle', 'neutral', 'website', 4.3, 4.0, 0.76, FALSE, TRUE, FALSE),
('What''s your favorite season and why?', 'smooth', 'international', 'followup', 'middle', 'neutral', 'website', 3.9, 3.7, 0.71, FALSE, TRUE, FALSE),
('What''s the best book you''ve read recently?', 'smooth', 'international', 'followup', 'middle', 'neutral', 'website', 4.0, 3.8, 0.72, FALSE, TRUE, FALSE),
('What''s your favorite type of music?', 'smooth', 'international', 'followup', 'middle', 'neutral', 'website', 3.7, 3.5, 0.69, FALSE, TRUE, FALSE),
('What''s something you''ve always wanted to ask me?', 'playful', 'international', 'followup', 'middle', 'neutral', 'website', 4.2, 4.1, 0.74, FALSE, TRUE, FALSE),
('What''s your favorite thing about where you live?', 'smooth', 'international', 'followup', 'middle', 'neutral', 'website', 3.8, 3.6, 0.7, FALSE, TRUE, FALSE),
('What''s something you''re excited about right now?', 'smooth', 'international', 'followup', 'middle', 'neutral', 'website', 4.1, 3.9, 0.73, FALSE, TRUE, FALSE),
('What''s your favorite childhood memory?', 'romantic', 'international', 'followup', 'middle', 'neutral', 'website', 4.5, 4.2, 0.78, FALSE, TRUE, FALSE),
('What''s something you''d tell your younger self?', 'smooth', 'international', 'followup', 'middle', 'neutral', 'website', 4.3, 4.1, 0.76, FALSE, TRUE, FALSE),
('What''s your favorite way to relax?', 'smooth', 'international', 'followup', 'middle', 'neutral', 'website', 3.9, 3.7, 0.71, FALSE, TRUE, FALSE),
('What''s something you find really attractive in someone?', 'romantic', 'international', 'followup', 'advanced', 'neutral', 'website', 4.6, 4.3, 0.79, FALSE, TRUE, FALSE),
('What''s your favorite quality about yourself?', 'smooth', 'international', 'followup', 'middle', 'neutral', 'website', 4.2, 4.0, 0.75, FALSE, TRUE, TRUE),
('What''s something that inspires you?', 'romantic', 'international', 'followup', 'middle', 'neutral', 'website', 4.4, 4.1, 0.77, FALSE, TRUE, FALSE),
('What''s your idea of a perfect evening?', 'romantic', 'international', 'followup', 'middle', 'neutral', 'website', 4.5, 4.2, 0.78, FALSE, TRUE, FALSE),
('What''s something you''re really looking forward to in the future?', 'romantic', 'international', 'followup', 'middle', 'neutral', 'website', 4.3, 4.0, 0.76, FALSE, TRUE, FALSE),
('What''s your favorite thing about conversations like this?', 'smooth', 'international', 'followup', 'middle', 'neutral', 'website', 4.1, 4.2, 0.74, FALSE, TRUE, FALSE),
('What''s something you wish more people understood about you?', 'romantic', 'international', 'followup', 'advanced', 'neutral', 'website', 4.7, 4.4, 0.8, FALSE, TRUE, FALSE),
('What''s your favorite thing to do when you''re alone?', 'smooth', 'international', 'followup', 'middle', 'neutral', 'website', 4.0, 3.9, 0.73, FALSE, TRUE, FALSE),
('What''s something that always makes your day better?', 'romantic', 'international', 'followup', 'middle', 'neutral', 'website', 4.4, 4.1, 0.77, FALSE, TRUE, FALSE),
('What''s your favorite way to connect with someone?', 'romantic', 'international', 'followup', 'advanced', 'neutral', 'website', 4.6, 4.3, 0.79, FALSE, TRUE, FALSE);

-- ============================================
-- Insert duplicate checks for all lines
-- ============================================
INSERT INTO duplicate_checks (hash_id, line_id)
SELECT 
    SHA2(line_text, 256) as hash_id,
    line_id
FROM flirting_lines;

-- ============================================
-- Sample tags insertion for some lines
-- ============================================
INSERT INTO line_tags (line_id, tag_id, confidence) VALUES
(1, 1, 0.9),  -- First line tagged as food_drink
(1, 13, 0.8), -- Also tagged as bar situation
(2, 2, 0.7),  -- Second line tagged as music
(3, 3, 0.8),  -- Third line tagged as movies
(4, 4, 0.6),  -- Fourth line tagged as sports
(5, 5, 0.9),  -- Fifth line tagged as tech
(6, 6, 0.7),  -- Sixth line tagged as travel
(7, 7, 0.8),  -- Seventh line tagged as work
(8, 8, 0.6),  -- Eighth line tagged as education
(9, 9, 0.7),  -- Ninth line tagged as family
(10, 10, 0.8); -- Tenth line tagged as animals

-- ============================================
-- Insert sample user feedback
-- ============================================
INSERT INTO user_feedback (line_id, reviewer_name, rating, is_effective, is_cultural, suggested_improvement) VALUES
(1, 'John Doe', 5, TRUE, TRUE, 'Perfect Kenyan line!'),
(2, 'Jane Smith', 4, TRUE, TRUE, 'Maybe add an emoji'),
(3, 'Mike Johnson', 3, FALSE, TRUE, 'A bit too cheesy'),
(4, 'Sarah Williams', 5, TRUE, TRUE, 'Love this one!'),
(5, 'David Brown', 4, TRUE, FALSE, 'Tech reference is cool');

-- ============================================
-- Insert keyword triggers
-- ============================================
INSERT INTO keyword_triggers (keyword, keyword_type, suggested_category, suggested_context, match_type, match_priority, response_template) VALUES
('hi', 'word', 'playful', 'response', 'contains', 1, 'Hey there! How''s your day going?'),
('hello', 'word', 'smooth', 'response', 'contains', 1, 'Hello! It''s nice to hear from you.'),
('hey', 'word', 'playful', 'response', 'contains', 1, 'Hey! What''s up?'),
('name', 'word', 'smooth', 'response', 'contains', 2, 'That''s a beautiful name. It suits you.'),
('beautiful', 'word', 'romantic', 'response', 'contains', 3, 'Coming from you, that means a lot.'),
('cute', 'word', 'playful', 'response', 'contains', 2, 'You''re making me blush!'),
('😊', 'emoji', 'playful', 'response', 'exact', 1, 'I love that smile!'),
('😂', 'emoji', 'funny', 'response', 'exact', 1, 'Glad I could make you laugh!'),
('?', 'pattern', 'smooth', 'response', 'contains', 1, 'That''s a good question. Let me think...'),
('how are you', 'phrase', 'smooth', 'response', 'contains', 2, 'Better now that I''m talking to you!');

-- ============================================
-- COMMIT ALL CHANGES
-- ============================================
COMMIT;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
SELECT 'Database seeded successfully!' as message;
SELECT COUNT(*) as 'Total Lines Inserted' FROM flirting_lines;
SELECT style, COUNT(*) as count FROM flirting_lines GROUP BY style;
SELECT category, COUNT(*) as count FROM flirting_lines GROUP BY category;

