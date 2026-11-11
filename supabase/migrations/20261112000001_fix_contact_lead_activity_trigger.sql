drop trigger if exists contact_lead_activity_trigger on public.contact_leads;
drop trigger if exists contact_lead_activity_after_insert_trigger on public.contact_leads;
drop trigger if exists contact_lead_activity_before_update_trigger on public.contact_leads;

create trigger contact_lead_activity_after_insert_trigger
  after insert on public.contact_leads
  for each row execute function public.record_contact_lead_activity();

create trigger contact_lead_activity_before_update_trigger
  before update on public.contact_leads
  for each row execute function public.record_contact_lead_activity();
