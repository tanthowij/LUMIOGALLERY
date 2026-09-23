import { useState, useEffect } from 'react';
import Header from './components/Header';
import AlbumsView from './components/AlbumsView';
import AlbumDetail from './components/AlbumDetail';
import AddAlbumModal from './components/AddAlbumModal';
import AdminLoginModal from './components/AdminLoginModal';
import ApprovalPanel from './components/ApprovalPanel';
import { useAuth } from './auth/AuthContext';
import type { Album } from './data/gallery';
import { albums as defaultAlbums } from './data/gallery';

export type LayoutMode = 'masonry' | 'grid';

export default function App() {
  const { user, role, isAdmin, isSuperAdmin, brandName, pendingCount, logout } = useAuth();
  const [albums, setAlbums] = useState<Album[]>(defaultAlbums);
  const [activeCategory, setActiveCategory] = useState<'all' | 'wedding' | 'wisuda'>('all');
  const [openAlbum, setOpenAlbum] = useState<Album | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showApproval, setShowApproval] = useState(false);
  const [layout, setLayout] = useState<LayoutMode>('masonry');

  // Check for shared album link on load
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const found = albums.find(a => a.shareToken === hash);
      if (found) setOpenAlbum(found);
    }
  }, []);

  const handleAddAlbumClick = () => {
    if (isAdmin) {
      setShowAddModal(true);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleAddAlbum = (album: Album) => {
    if (!isAdmin) {
      setShowAddModal(false);
      setShowLoginModal(true);
      return;
    }
    setAlbums(prev => [album, ...prev]);
    setShowAddModal(false);
    setOpenAlbum(album);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', color: 'var(--foreground)' }}>
      <Header
        openAlbum={openAlbum}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        layout={layout}
        setLayout={setLayout}
        onBack={() => { setOpenAlbum(null); window.location.hash = ''; }}
        onAddAlbum={handleAddAlbumClick}
        isAdmin={isAdmin}
        isSuperAdmin={isSuperAdmin}
        role={role}
        brandName={brandName}
        pendingCount={pendingCount}
        user={user}
        onLoginClick={() => setShowLoginModal(true)}
        onApprovalClick={() => setShowApproval(true)}
        onLogout={logout}
      />

      <main>
        {openAlbum ? (
          <AlbumDetail album={openAlbum} layout={layout} />
        ) : (
          <AlbumsView
            albums={albums}
            activeCategory={activeCategory}
            onOpenAlbum={setOpenAlbum}
            onAddAlbum={handleAddAlbumClick}
          />
        )}
      </main>

      {showAddModal && isAdmin && (
        <AddAlbumModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddAlbum}
        />
      )}

      {showLoginModal && (
        <AdminLoginModal onClose={() => setShowLoginModal(false)} />
      )}

      {showApproval && isSuperAdmin && (
        <ApprovalPanel onClose={() => setShowApproval(false)} />
      )}
    </div>
  );
}
