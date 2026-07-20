import { useState, useEffect } from 'react';

export function useNavAuth() {
  const [pages, setPages] = useState<string[]>([]);
  const [role, setRole] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPages() {
      try {
        let storedRole = localStorage.getItem('role') || '';
        if (storedRole.startsWith('"') && storedRole.endsWith('"')) {
            storedRole = storedRole.slice(1, -1);
        }
        let token = localStorage.getItem('jhi-authenticationToken') || '';
        if (token.startsWith('"') && token.endsWith('"')) {
            token = token.slice(1, -1);
        }
        setRole(storedRole);

        if (!storedRole || !token) {
            setIsLoading(false);
            return;
        }

        const apiUrl = (window as any)?._env_?.SERVER_API_URL || 'http://localhost:30019/v1/rai/backend';
        const url = `${apiUrl}/pageauthoritynew?role=${storedRole}`;

        const res = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data && data.pages) {
             setPages(Object.keys(data.pages));
          }
        }
      } catch (err) {
        console.error("Failed to fetch nav auth", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPages();
  }, []);

  return { pages, role, isLoading };
}
