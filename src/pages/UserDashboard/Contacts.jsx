import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PageHeader, EmptyState } from '../../components/common';
import { Users, Search, Mail, Phone } from 'lucide-react';

export default function UContacts() {
  const { currentCompany, leads } = useAuth();
  const [search, setSearch] = useState('');

  // Contacts are derived from leads that have a contact person
  const contacts = useMemo(() => {
    return leads
      .filter(l => l.companyId === currentCompany?.id && l.contact)
      .map(l => ({
        id: l.id,
        name: l.contact,
        company: l.name,
        email: l.email,
        phone: l.phone,
        status: l.status,
        avatar: l.contact.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [leads, currentCompany]);

  const filtered = useMemo(() => {
    return contacts.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [contacts, search]);

  // Group contacts by first letter for a nice clustered view
  const grouped = useMemo(() => {
    const groups = {};
    filtered.forEach(c => {
      const letter = c.name[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(c);
    });
    return groups;
  }, [filtered]);

  return (
    <div className="page-enter">
      <PageHeader title="Contacts Directory" subtitle={`${contacts.length} total contacts`} />

      <div className="mb-6 relative max-w-md">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input className="input-field pl-11 py-3 text-sm rounded-xl bg-card border-primary"
          placeholder="Search by name, company, or email..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Users} title="No Contacts Found" description="Add more leads with contact details." />
      ) : (
        <div className="flex flex-col gap-8">
          {Object.keys(grouped).sort().map(letter => (
            <div key={letter} className="flex flex-col md:flex-row items-start gap-4 md:gap-8">
              {/* Letter Heading */}
              <div className="w-10 h-10 rounded-xl bg-secondary border border-primary flex items-center justify-center flex-shrink-0 sticky top-4">
                <span className="font-display font-800 text-lg text-primary">{letter}</span>
              </div>

              {/* Contact Grid */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {grouped[letter].map(c => (
                  <div key={c.id} className="card card-hover p-4 flex flex-col justify-between group h-full">
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center font-700 text-lg flex-shrink-0 text-white"
                          style={{ background: 'linear-gradient(135deg, #0EA5E9, #6366F1)' }}>
                          {c.avatar}
                        </div>
                        <div className="min-w-0">
                          <p className="font-700 text-base text-primary truncate leading-tight">{c.name}</p>
                          <p className="text-sm text-secondary truncate mt-0.5">{c.company}</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-5">
                        <a href={`mailto:${c.email}`} className="text-sm flex items-center gap-2 group-hover:text-blue-400 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                          <Mail size={14} className="text-muted" /> <span className="truncate">{c.email}</span>
                        </a>
                        <a href={`tel:${c.phone}`} className="text-sm flex items-center gap-2 group-hover:text-green-400 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                          <Phone size={14} className="text-muted" /> <span className="truncate">{c.phone}</span>
                        </a>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <a href={`mailto:${c.email}`} className="btn-secondary flex-1 justify-center py-2 text-xs">Email</a>
                      <a href={`tel:${c.phone}`} className="btn-secondary flex-1 justify-center py-2 text-xs">Call</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
