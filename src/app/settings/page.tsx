import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Configure your InfluencerReach settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Email Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <h3 className="font-medium text-yellow-800 mb-2">Important Note:</h3>
              <p className="text-yellow-700">
                If using Resend Free plan, please ensure you have verified your sending domain in the Resend dashboard.
                Otherwise, you can only send emails to your registered Resend email address.
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Environment Variables</h3>
              <p className="text-muted-foreground mb-4">
                Make sure to set the following environment variables in your deployment:
              </p>
              <div className="bg-muted p-4 rounded-md font-mono text-sm">
                <p>SUPABASE_URL=your_supabase_url</p>
                <p>SUPABASE_ANON_KEY=your_supabase_anon_key</p>
                <p>RESEND_API_KEY=your_resend_api_key</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>CSV Import Format</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            When importing contacts via CSV, please use the following format:
          </p>
          <div className="bg-muted p-4 rounded-md font-mono text-sm">
            <p>name,username,email</p>
            <p>John Doe,johndoe,john@example.com</p>
            <p>Jane Smith,janesmith,jane@example.com</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
