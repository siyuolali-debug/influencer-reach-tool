'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { replaceVariables } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

interface Contact {
  id: string;
  name: string;
  email: string;
  platform: string;
  status: 'Pending' | 'Sending...' | 'Sent' | 'Failed';
  created_at: string;
}

interface Template {
  id: string;
  title: string;
  subject: string;
  body: string;
  category: string;
  created_at: string;
}

const ContactsPage = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch influencers from Supabase
  useEffect(() => {
    const fetchInfluencers = async () => {
      if (!supabase) {
        console.error('Supabase client not initialized');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('influencers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching influencers:', error);
      } else {
        setContacts(data.map(item => ({
          ...item,
          status: item.status === 'pending' ? 'Pending' : item.status === 'sent' ? 'Sent' : 'Failed'
        })));
      }
      setLoading(false);
    };

    const fetchTemplates = async () => {
      if (!supabase) {
        console.error('Supabase client not initialized');
        return;
      }

      const { data, error } = await supabase
        .from('email_templates')
        .select('*');

      if (error) {
        console.error('Error fetching templates:', error);
      } else {
        setTemplates(data);
        if (data.length > 0) {
          setSelectedTemplate(data[0].id);
        }
      }
    };

    fetchInfluencers();
    fetchTemplates();
  }, []);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleStartSending = async () => {
    if (!supabase) {
      console.error('Supabase client not initialized');
      return;
    }

    for (const contact of contacts) {
      // Update status to Sending... in UI
      setContacts(prev => 
        prev.map(c => c.id === contact.id ? { ...c, status: 'Sending...' } : c)
      );

      // Get selected template
      const template = templates.find(t => t.id === selectedTemplate);
      if (!template) continue;

      // Replace variables in template
      const subject = replaceVariables(template.subject, {
        name: contact.name,
        platform: contact.platform,
      });

      const htmlContent = replaceVariables(template.body, {
        name: contact.name,
        platform: contact.platform,
      });

      try {
        // Call send API
        const response = await fetch('/api/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: contact.email,
            subject: subject,
            htmlContent: htmlContent,
          }),
        });

        const result = await response.json();

        // Update status in Supabase
        let newStatus = 'failed';
        if (result.success) {
          newStatus = 'sent';
        }

        const { error: updateError } = await supabase
          .from('influencers')
          .update({ status: newStatus })
          .eq('id', contact.id);

        if (updateError) {
          console.error('Error updating status in Supabase:', updateError);
        }

        // Update status in UI
        setContacts(prev => 
          prev.map(c => c.id === contact.id ? { ...c, status: result.success ? 'Sent' : 'Failed' } : c)
        );
      } catch (error) {
        console.error('Error sending email:', error);
        // Update status to Failed if error
        setContacts(prev => 
          prev.map(c => c.id === contact.id ? { ...c, status: 'Failed' } : c)
        );
      }

      // Wait 1 second before sending next email
      await sleep(1000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Outreach Engine</h1>
          <p className="text-muted-foreground">Manage your influencer outreach campaigns</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Contact List</CardTitle>
            <div className="flex items-center space-x-2">
              <select
                className="rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                disabled={templates.length === 0}
              >
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.title}
                  </option>
                ))}
              </select>
              <Button 
                onClick={handleStartSending} 
                disabled={contacts.length === 0 || !selectedTemplate}
              >
                Start Sending
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading influencers...</div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-8">No influencers found. Please add some in the dashboard.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium">{contact.name}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{contact.platform}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        contact.status === 'Pending' ? 'bg-gray-100 text-gray-800' :
                        contact.status === 'Sending...' ? 'bg-blue-100 text-blue-800' :
                        contact.status === 'Sent' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {contact.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactsPage;