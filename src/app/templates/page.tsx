'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/lib/use-toast';
import { replaceVariables } from '@/lib/utils';

interface Template {
  id: string;
  title: string;
  subject: string;
  body: string;
  category: string;
  created_at: string;
}

const TemplatesPage = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTestEmailDialogOpen, setIsTestEmailDialogOpen] = useState(false);
  const [testEmail, setTestEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [sendingTestEmail, setSendingTestEmail] = useState<boolean>(false);
  const [currentTemplate, setCurrentTemplate] = useState<Partial<Template>>({
    title: '',
    subject: '',
    body: '',
    category: '',
  });
  const { toastSuccess, toastError } = useToast();

  // Fetch templates from Supabase
  useEffect(() => {
    const fetchTemplates = async () => {
      if (!supabase) {
        console.error('Supabase client not initialized');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching templates:', error);
      } else {
        setTemplates(data);
      }
      setLoading(false);
    };

    fetchTemplates();
  }, []);

  const handleCreateTemplate = () => {
    setCurrentTemplate({ title: '', subject: '', body: '', category: '' });
    setIsDialogOpen(true);
  };

  const handleEditTemplate = (template: Template) => {
    setCurrentTemplate(template);
    setIsDialogOpen(true);
  };

  const handleSaveTemplate = async () => {
    try {
      if (!supabase) {
        toastError('Supabase client not initialized. Please check your environment variables.');
        return;
      }

      if (currentTemplate.id) {
        // Update existing template
        const { error } = await supabase
          .from('email_templates')
          .update({
            title: currentTemplate.title,
            subject: currentTemplate.subject,
            body: currentTemplate.body,
            category: currentTemplate.category,
          })
          .eq('id', currentTemplate.id);

        if (error) {
          console.error('Error updating template:', error);
          toastError(`Failed to update template: ${error.message}`);
          return;
        }

        // Update local state
        setTemplates(
          templates.map((t) =>
            t.id === currentTemplate.id
              ? {
                  ...t,
                  title: currentTemplate.title || t.title,
                  subject: currentTemplate.subject || t.subject,
                  body: currentTemplate.body || t.body,
                  category: currentTemplate.category || t.category,
                }
              : t
          )
        );
        
        toastSuccess('Template updated successfully');
      } else {
        // Create new template
        const { data, error } = await supabase
          .from('email_templates')
          .insert({
            title: currentTemplate.title,
            subject: currentTemplate.subject,
            body: currentTemplate.body,
            category: currentTemplate.category,
          })
          .select();

        if (error) {
          console.error('Error creating template:', error);
          toastError(`Failed to create template: ${error.message}`);
          return;
        }

        // Add to local state
        if (data && data.length > 0) {
          setTemplates([data[0], ...templates]);
        }
        
        toastSuccess('Template created successfully');
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving template:', error);
      toastError(`Failed to save template: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Handle send test email
  const handleSendTestEmail = async () => {
    try {
      if (!testEmail) {
        toastError('Please enter a test email address');
        return;
      }

      if (!currentTemplate.subject || !currentTemplate.body) {
        toastError('Template must have a subject and body');
        return;
      }

      setSendingTestEmail(true);

      // Replace variables with default values
      const subject = replaceVariables(currentTemplate.subject, {
        name: 'Test User',
        platform: 'Test Platform',
        followers: '1000',
      });

      const htmlContent = replaceVariables(currentTemplate.body, {
        name: 'Test User',
        platform: 'Test Platform',
        followers: '1000',
      });

      // Call send API
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testEmail,
          subject: subject,
          htmlContent: htmlContent,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toastSuccess('Test email sent successfully');
        setIsTestEmailDialogOpen(false);
        setTestEmail('');
      } else {
        toastError(`Failed to send test email: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      toastError(`Failed to send test email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSendingTestEmail(false);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      if (!supabase) {
        toastError('Supabase client not initialized. Please check your environment variables.');
        return;
      }

      const { error } = await supabase
        .from('email_templates')
        .delete()
        .eq('id', id);

      if (error) {
          console.error('Error deleting template:', error);
          toastError(`Failed to delete template: ${error.message}`);
          return;
        }

      // Remove from local state
      setTemplates(templates.filter((t) => t.id !== id));
      
      toastSuccess('Template deleted successfully');
    } catch (error) {
      console.error('Error deleting template:', error);
      toastError(`Failed to delete template: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Templates</h1>
          <p className="text-muted-foreground">Manage your email templates</p>
        </div>
        <Button onClick={handleCreateTemplate}>
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Email Templates</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading templates...</div>
          ) : templates.length === 0 ? (
            <div className="text-center py-8">No templates found. Create your first template.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">{template.title}</TableCell>
                    <TableCell>{template.subject}</TableCell>
                    <TableCell>{template.category || '-'}</TableCell>
                    <TableCell>
                      {new Date(template.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditTemplate(template)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => handleDeleteTemplate(template.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {currentTemplate.id ? 'Edit Template' : 'Create Template'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Template Title</label>
              <Input
                value={currentTemplate.title || ''}
                onChange={(e) =>
                  setCurrentTemplate({ ...currentTemplate, title: e.target.value })
                }
                placeholder="Enter template title"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Subject</label>
              <Input
                value={currentTemplate.subject || ''}
                onChange={(e) =>
                  setCurrentTemplate({ ...currentTemplate, subject: e.target.value })
                }
                placeholder="Enter email subject"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Input
                value={currentTemplate.category || ''}
                onChange={(e) =>
                  setCurrentTemplate({ ...currentTemplate, category: e.target.value })
                }
                placeholder="Enter template category (e.g., outreach, follow_up)"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Body</label>
              <textarea
                className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={currentTemplate.body || ''}
                onChange={(e) =>
                  setCurrentTemplate({ ...currentTemplate, body: e.target.value })
                }
                placeholder="Enter email body"
              />
            </div>
            <div className="p-3 bg-muted rounded-md text-sm">
              <p className="font-medium mb-1">Available Variables:</p>
              <p className="text-muted-foreground">
                {'{{name}}'} - Influencer's name<br />
                {'{{platform}}'} - Social media platform<br />
                {'{{followers}}'} - Number of followers
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                onClick={() => setIsTestEmailDialogOpen(true)}
              >
                <Send className="h-4 w-4 mr-2" />
                Send Test Email
              </Button>
              <Button onClick={handleSaveTemplate}>
                Save Template
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Test Email Dialog */}
      <Dialog open={isTestEmailDialogOpen} onOpenChange={setIsTestEmailDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Test Email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Test Email Address</label>
              <Input
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="Enter email address to receive test email"
                type="email"
                required
              />
            </div>
            <div className="p-3 bg-muted rounded-md text-sm">
              <p className="font-medium mb-1">Note:</p>
              <p className="text-muted-foreground">
                Variables like {'{{name}}'} will be replaced with default values (e.g., "Test User").
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsTestEmailDialogOpen(false)}
              disabled={sendingTestEmail}
            >
              Cancel
            </Button>
            <Button onClick={handleSendTestEmail} disabled={sendingTestEmail}>
              {sendingTestEmail && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              Send Test Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TemplatesPage;