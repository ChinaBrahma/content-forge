import { useState, useEffect } from 'react';
import { Plus, Trash2, Copy, Loader2, Key, AlertTriangle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useToast } from '@/hooks/use-toast';
import { tokensApi, ApiToken } from '@/lib/api';

export default function Tokens() {
  const [tokens, setTokens] = useState<ApiToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showTokenDialog, setShowTokenDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [tokenToDelete, setTokenToDelete] = useState<string | null>(null);
  const [newTokenName, setNewTokenName] = useState('');
  const [generatedToken, setGeneratedToken] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadTokens();
  }, []);

  const loadTokens = async () => {
    setIsLoading(true);
    const response = await tokensApi.listTokens();
    if (response.data) {
      setTokens(response.data);
    }
    setIsLoading(false);
  };

  const handleCreateToken = async () => {
    if (!newTokenName.trim()) {
      toast({
        variant: 'destructive',
        title: 'Name required',
        description: 'Please enter a name for the token.',
      });
      return;
    }

    setIsCreating(true);
    const response = await tokensApi.createToken(newTokenName);
    setIsCreating(false);

    if (response.error) {
      toast({
        variant: 'destructive',
        title: 'Creation failed',
        description: response.error,
      });
    } else if (response.data) {
      setGeneratedToken(response.data.token);
      setTokens((prev) => [response.data!.tokenInfo, ...prev]);
      setShowCreateDialog(false);
      setShowTokenDialog(true);
      setNewTokenName('');
    }
  };

  const handleDeleteToken = async () => {
    if (!tokenToDelete) return;

    const response = await tokensApi.deleteToken(tokenToDelete);
    if (response.error) {
      toast({
        variant: 'destructive',
        title: 'Deletion failed',
        description: response.error,
      });
    } else {
      setTokens((prev) => prev.filter((t) => t.id !== tokenToDelete));
      toast({
        title: 'Token deleted',
        description: 'The API token has been deleted.',
      });
    }
    setShowDeleteDialog(false);
    setTokenToDelete(null);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: 'Copied!',
      description: 'Token copied to clipboard.',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">API Tokens</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage API tokens for programmatic access
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Token
          </Button>
        </div>

        {/* Tokens List */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Active Tokens</CardTitle>
            <CardDescription>
              Tokens are used to authenticate API requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : tokens.length === 0 ? (
              <div className="text-center py-8">
                <Key className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No API tokens yet</p>
                <p className="text-sm text-muted-foreground/70">
                  Create your first token to get started
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[60px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tokens.map((token) => (
                    <TableRow key={token.id}>
                      <TableCell className="font-medium">{token.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(token.createdAt)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {token.lastUsed ? formatDate(token.lastUsed) : 'Never'}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={token.status === 'active' ? 'default' : 'secondary'}
                          className={
                            token.status === 'active'
                              ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                              : ''
                          }
                        >
                          {token.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => {
                            setTokenToDelete(token.id);
                            setShowDeleteDialog(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Token Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create API Token</DialogTitle>
            <DialogDescription>
              Create a new token for API access. Choose a descriptive name.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tokenName">Token Name</Label>
              <Input
                id="tokenName"
                placeholder="e.g., Production API Key"
                value={newTokenName}
                onChange={(e) => setNewTokenName(e.target.value)}
                className="bg-secondary/50"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateToken} disabled={isCreating}>
              {isCreating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Generate Token
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Token Display Dialog */}
      <Dialog open={showTokenDialog} onOpenChange={setShowTokenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              Token Created
            </DialogTitle>
            <DialogDescription>
              Copy your new API token now. It won't be shown again!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg border border-border">
              <code className="flex-1 text-sm break-all font-mono">
                {generatedToken}
              </code>
              <Button
                variant="ghost"
                size="icon"
                onClick={copyToClipboard}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="flex items-start gap-2 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-500">
                Make sure to copy this token now. You won't be able to see it again!
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowTokenDialog(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Token</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this token? Any applications using this
              token will no longer be able to authenticate.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteToken}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
