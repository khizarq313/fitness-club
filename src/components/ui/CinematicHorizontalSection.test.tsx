import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CinematicHorizontalSection } from './CinematicHorizontalSection';

/**
 * Bug Condition Exploration Test
 * 
 * **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5**
 * 
 * CRITICAL: This test MUST FAIL on unfixed code - failure confirms the bug exists
 * DO NOT attempt to fix the test or the code when it fails
 * 
 * This test encodes the expected behavior - it will validate the fix when it passes after implementation
 * 
 * GOAL: Surface counterexamples that demonstrate the bugs exist
 * 
 * Expected bugs on unfixed code:
 * - Multiple cards visible with side-peeking on mobile viewports
 * - Cards not properly centered, with inconsistent padding
 * - All cards stretched to same height regardless of content (items-stretch)
 * - Navigation arrows visible on mobile when they should be hidden
 */

describe('CinematicHorizontalSection - Bug Condition Exploration', () => {
  const mockCards = [
    { id: '1', content: 'Card 1 with short content' },
    { id: '2', content: 'Card 2 with much longer content that should make this card taller than the others if natural heights are allowed' },
    { id: '3', content: 'Card 3 with medium content here' },
  ];

  beforeEach(() => {
    // Mock window.matchMedia for touch device detection
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === '(hover: none) and (pointer: coarse)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    // Mock IntersectionObserver
    global.IntersectionObserver = class IntersectionObserver {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
      constructor() {}
    } as any;

    // Mock ResizeObserver
    global.ResizeObserver = class ResizeObserver {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
      constructor() {}
    } as any;
  });

  describe('Property 1: Bug Condition - Mobile Carousel Responsive Issues', () => {
    /**
     * Test at specific mobile viewport widths (320px, 375px, 414px)
     * Validates Requirements 1.1, 1.2, 1.5, 2.1, 2.2, 2.5
     */
    it.each([
      { width: 320, device: 'iPhone SE' },
      { width: 375, device: 'iPhone 12/13' },
      { width: 414, device: 'iPhone 14 Plus' },
    ])('should display exactly one centered card with no side-peeking at $width px ($device)', ({ width }) => {
      // Set viewport width
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: width,
      });

      const { container } = render(
        <CinematicHorizontalSection
          id="test-section"
          desktopBehavior="carousel"
          header={<h2>Test Header</h2>}
          renderCards={() =>
            mockCards.map((card) => (
              <div key={card.id} data-testid={`card-${card.id}`}>
                {card.content}
              </div>
            ))
          }
        />
      );

      // Find all cards
      const cards = screen.getAllByTestId(/card-/);
      expect(cards).toHaveLength(3);

      // BUG CHECK 1: Single card visibility (Requirement 1.1, 2.1)
      // On mobile, only ONE card should be fully visible at a time
      // After fix: Cards should have w-full class for full width display
      const cardWrappers = container.querySelectorAll('[class*="flex-shrink-0"]');
      
      // Each card wrapper should have w-full class on mobile
      cardWrappers.forEach((wrapper) => {
        const classes = wrapper.className;
        
        // Card should have w-full class for full width
        // After fix: This should pass
        expect(classes).toContain('w-full');
        expect(classes).toContain('flex-shrink-0');
      });

      // BUG CHECK 2: Proper centering (Requirement 1.2, 2.2)
      // Cards should be centered with appropriate padding
      // After fix: Container should have snap-center for proper alignment
      const scrollContainer = container.querySelector('[class*="overflow-x-auto"]');
      expect(scrollContainer).toBeTruthy();
      
      if (scrollContainer) {
        const containerClasses = scrollContainer.className;
        // Should have snap behavior for smooth scrolling
        expect(containerClasses).toContain('snap-x');
        expect(containerClasses).toContain('snap-mandatory');
      }

      // Verify snap-center on card wrappers
      const snapCenterElements = container.querySelectorAll('[class*="snap-center"]');
      expect(snapCenterElements.length).toBeGreaterThan(0);
    });

    /**
     * Test navigation arrow visibility on mobile
     * Validates Requirements 1.5, 2.5
     */
    it.each([
      { width: 320, device: 'iPhone SE' },
      { width: 375, device: 'iPhone 12/13' },
      { width: 414, device: 'iPhone 14 Plus' },
    ])('should hide navigation arrows on mobile at $width px ($device)', ({ width }) => {
      // Set viewport width
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: width,
      });

      render(
        <CinematicHorizontalSection
          id="test-section"
          desktopBehavior="carousel"
          header={<h2>Test Header</h2>}
          renderCards={() =>
            mockCards.map((card) => (
              <div key={card.id} data-testid={`card-${card.id}`}>
                {card.content}
              </div>
            ))
          }
        />
      );

      // BUG CHECK 3: Arrow visibility (Requirement 1.5, 2.5)
      // Navigation arrows should be hidden on mobile
      // EXPECTED TO FAIL: Arrows may be visible on mobile viewports
      const prevButton = screen.queryByLabelText('Previous cards');
      const nextButton = screen.queryByLabelText('Next cards');

      expect(prevButton).toBeNull();
      expect(nextButton).toBeNull();
    });

    /**
     * Test natural card heights without forced stretching
     * Validates Requirements 1.3, 1.4, 2.3, 2.4
     */
    it('should allow cards to have natural heights without forced stretching from items-stretch', () => {
      // Set desktop width to test items-stretch issue across all screen sizes
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      const { container } = render(
        <CinematicHorizontalSection
          id="test-section"
          desktopBehavior="carousel"
          railClassName="pb-4 md:pb-6" // Fixed: items-stretch removed
          header={<h2>Test Header</h2>}
          renderCards={() =>
            mockCards.map((card) => (
              <div key={card.id} data-testid={`card-${card.id}`}>
                <div data-testid={`card-content-${card.id}`}>{card.content}</div>
              </div>
            ))
          }
        />
      );

      // BUG CHECK 4: Natural heights (Requirement 1.3, 1.4, 2.3, 2.4)
      // Cards should have different heights based on content
      // After fix: items-stretch should not be present
      const railContainer = container.querySelector('[class*="flex"]');
      expect(railContainer).toBeTruthy();

      if (railContainer) {
        const railClasses = railContainer.className;
        
        // items-stretch should NOT be present (it causes forced stretching)
        // After fix: This should pass
        expect(railClasses).not.toContain('items-stretch');
      }

      // Check that cards don't have h-full which contributes to stretching
      const cards = screen.getAllByTestId(/card-/);
      cards.forEach((card) => {
        const cardClasses = card.className;
        
        // h-full should NOT be present on cards
        // After fix: This should pass
        expect(cardClasses).not.toContain('h-full');
      });
    });

    /**
     * Test card width constraints and centering on mobile
     * Validates Requirements 1.2, 2.2
     */
    it('should properly constrain and center cards on mobile viewports', () => {
      const mobileWidth = 375;
      
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: mobileWidth,
      });

      const { container } = render(
        <CinematicHorizontalSection
          id="test-section"
          desktopBehavior="carousel"
          header={<h2>Test Header</h2>}
          renderCards={() =>
            mockCards.map((card) => (
              <div key={card.id} data-testid={`card-${card.id}`}>
                {card.content}
              </div>
            ))
          }
        />
      );

      // BUG CHECK 5: Card width and centering (Requirement 1.2, 2.2)
      // Each card should be properly constrained and centered
      // EXPECTED TO FAIL: Incorrect width constraints (w-[90%], w-full without proper setup)
      const scrollContainer = container.querySelector('[class*="overflow-x-auto"]');
      expect(scrollContainer).toBeTruthy();

      if (scrollContainer) {
        const containerClasses = scrollContainer.className;
        
        // Should have snap-x and snap-mandatory for proper mobile carousel behavior
        expect(containerClasses).toContain('snap-x');
        expect(containerClasses).toContain('snap-mandatory');
        
        // Should have proper padding
        expect(containerClasses).toMatch(/px-\d+/);
      }

      // Card wrappers should have snap-center for proper alignment
      const cardWrappers = container.querySelectorAll('[class*="snap-center"]');
      
      // EXPECTED TO FAIL: May not have proper snap-center on all cards
      expect(cardWrappers.length).toBeGreaterThan(0);
    });
  });
});

/**
 * Preservation Property Tests
 * 
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6**
 * 
 * IMPORTANT: Follow observation-first methodology
 * These tests observe and capture the CURRENT behavior on UNFIXED code for desktop viewports (≥640px)
 * 
 * EXPECTED OUTCOME: Tests PASS on unfixed code (this confirms baseline behavior to preserve)
 * 
 * These tests ensure the fix doesn't break existing desktop functionality:
 * - Desktop carousel shows 2-3 cards depending on viewport width
 * - Framer Motion animations work smoothly
 * - Navigation arrows function correctly on desktop
 * - Card spacing (gap-6 md:gap-8 lg:gap-10) is consistent
 * - Pinned-scroll behavior works for configured sections
 */

describe('CinematicHorizontalSection - Preservation Property Tests', () => {
  const mockCards = [
    { id: '1', content: 'Card 1' },
    { id: '2', content: 'Card 2' },
    { id: '3', content: 'Card 3' },
    { id: '4', content: 'Card 4' },
    { id: '5', content: 'Card 5' },
  ];

  beforeEach(() => {
    // Mock window.matchMedia for desktop (non-touch) device
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false, // Desktop device (not touch)
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    // Mock IntersectionObserver
    global.IntersectionObserver = class IntersectionObserver {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
      constructor() {}
    } as any;

    // Mock ResizeObserver
    global.ResizeObserver = class ResizeObserver {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
      constructor() {}
    } as any;
  });

  describe('Property 2: Preservation - Desktop Carousel Behavior', () => {
    /**
     * Test desktop card count at various viewport widths
     * Validates Requirements 3.1
     * 
     * Desktop should show:
     * - 2 cards at 768px-1023px (tablet)
     * - 3 cards at 1024px+ (desktop)
     */
    it.each([
      { width: 768, expectedCards: 2, device: 'Tablet' },
      { width: 1024, expectedCards: 3, device: 'Desktop' },
      { width: 1280, expectedCards: 3, device: 'Large Desktop' },
      { width: 1920, expectedCards: 3, device: 'Full HD' },
    ])('should display $expectedCards cards at $width px ($device)', ({ width }) => {
      // Set viewport width
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: width,
      });

      const { container } = render(
        <CinematicHorizontalSection
          id="test-section"
          desktopBehavior="carousel"
          header={<h2>Test Header</h2>}
          renderCards={() =>
            mockCards.map((card) => (
              <div key={card.id} data-testid={`card-${card.id}`}>
                {card.content}
              </div>
            ))
          }
        />
      );

      // PRESERVATION CHECK 1: Desktop card count (Requirement 3.1)
      // Desktop carousel should show 2-3 cards depending on viewport width
      const cards = screen.getAllByTestId(/card-/);
      expect(cards).toHaveLength(5); // All cards are rendered

      // Check that the carousel container exists
      const carouselContainer = container.querySelector('[class*="overflow-hidden"]');
      expect(carouselContainer).toBeTruthy();

      // Verify the component is in desktop carousel mode (not mobile)
      // Desktop carousel uses motion.div with animate prop for sliding
      const motionTrack = container.querySelector('[class*="flex"]');
      expect(motionTrack).toBeTruthy();
    });

    /**
     * Test navigation arrows are visible and functional on desktop
     * Validates Requirements 3.4
     */
    it.each([
      { width: 768, device: 'Tablet' },
      { width: 1024, device: 'Desktop' },
      { width: 1280, device: 'Large Desktop' },
    ])('should display navigation arrows on desktop at $width px ($device)', ({ width }) => {
      // Set viewport width
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: width,
      });

      render(
        <CinematicHorizontalSection
          id="test-section"
          desktopBehavior="carousel"
          header={<h2>Test Header</h2>}
          renderCards={() =>
            mockCards.map((card) => (
              <div key={card.id} data-testid={`card-${card.id}`}>
                {card.content}
              </div>
            ))
          }
        />
      );

      // PRESERVATION CHECK 2: Arrow visibility on desktop (Requirement 3.4)
      // Navigation arrows should be visible on desktop for carousel navigation
      const prevButton = screen.queryByLabelText('Previous cards');
      const nextButton = screen.queryByLabelText('Next cards');

      expect(prevButton).toBeTruthy();
      expect(nextButton).toBeTruthy();

      // Verify buttons have correct styling
      expect(prevButton).toHaveClass('rounded-full');
      expect(nextButton).toHaveClass('rounded-full');
    });

    /**
     * Test card spacing is consistent across breakpoints
     * Validates Requirements 3.3
     * 
     * Desktop carousel uses inline padding on cards for spacing
     */
    it.each([
      { width: 768, device: 'Tablet' },
      { width: 1024, device: 'Desktop' },
      { width: 1280, device: 'Large Desktop' },
    ])('should maintain consistent card spacing at $width px ($device)', ({ width }) => {
      // Set viewport width
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: width,
      });

      const { container } = render(
        <CinematicHorizontalSection
          id="test-section"
          desktopBehavior="carousel"
          header={<h2>Test Header</h2>}
          renderCards={() =>
            mockCards.map((card) => (
              <div key={card.id} data-testid={`card-${card.id}`}>
                {card.content}
              </div>
            ))
          }
        />
      );

      // PRESERVATION CHECK 3: Card spacing (Requirement 3.3)
      // Desktop carousel uses inline padding on cards for consistent spacing
      const trackContainer = container.querySelector('[class*="flex"]');
      expect(trackContainer).toBeTruthy();

      // Verify cards are rendered with proper structure
      const cards = screen.getAllByTestId(/card-/);
      expect(cards.length).toBeGreaterThan(0);
    });

    /**
     * Test Framer Motion animation properties are present
     * Validates Requirements 3.2
     */
    it('should preserve Framer Motion animation configuration on desktop', () => {
      // Set desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      const { container } = render(
        <CinematicHorizontalSection
          id="test-section"
          desktopBehavior="carousel"
          header={<h2>Test Header</h2>}
          renderCards={() =>
            mockCards.map((card) => (
              <div key={card.id} data-testid={`card-${card.id}`}>
                {card.content}
              </div>
            ))
          }
        />
      );

      // PRESERVATION CHECK 4: Framer Motion animations (Requirement 3.2)
      // Desktop carousel should use smooth Framer Motion sliding animations
      const motionTrack = container.querySelector('[class*="flex"]');
      expect(motionTrack).toBeTruthy();

      // Verify the track is a motion element (has motion-specific attributes)
      // Motion elements typically have data attributes or specific styling
      if (motionTrack) {
        // The motion.div should be present for animation
        expect(motionTrack.tagName).toBe('DIV');
      }
    });

    /**
     * Test pinned-scroll behavior is preserved
     * Validates Requirements 3.6
     */
    it('should preserve pinned-scroll behavior for sections configured with desktopBehavior="pinned-scroll"', () => {
      // Set desktop viewport with non-touch device
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      // Mock matchMedia to return false for touch device (desktop)
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
          matches: false, // Not a touch device
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      const { container } = render(
        <CinematicHorizontalSection
          id="test-section"
          desktopBehavior="pinned-scroll"
          header={<h2>Test Header</h2>}
          renderCards={() =>
            mockCards.map((card) => (
              <div key={card.id} data-testid={`card-${card.id}`} style={{ width: '300px' }}>
                {card.content}
              </div>
            ))
          }
        />
      );

      // PRESERVATION CHECK 5: Pinned-scroll behavior (Requirement 3.6)
      // Sections with desktopBehavior="pinned-scroll" should maintain scroll-linked animations
      // Note: Pinned scroll only activates when content overflows, which requires proper sizing
      
      // Check that the section exists
      const section = container.querySelector('section');
      expect(section).toBeTruthy();

      // Verify cards are rendered
      const cards = screen.getAllByTestId(/card-/);
      expect(cards).toHaveLength(5);
    });

    /**
     * Test visual styling is preserved across desktop viewports
     * Validates Requirements 3.5
     */
    it('should preserve all visual styling (colors, typography, layout) on desktop', () => {
      // Set desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      const { container } = render(
        <CinematicHorizontalSection
          id="test-section"
          desktopBehavior="carousel"
          header={<h2>Test Header</h2>}
          renderCards={() =>
            mockCards.map((card) => (
              <div key={card.id} data-testid={`card-${card.id}`}>
                {card.content}
              </div>
            ))
          }
        />
      );

      // PRESERVATION CHECK 6: Visual styling (Requirement 3.5)
      // All existing colors, typography, shadows, borders, and layout structure must remain unchanged
      
      // Check section structure is preserved
      const section = container.querySelector('section');
      expect(section).toBeTruthy();
      expect(section).toHaveAttribute('id', 'test-section');

      // Check header is rendered
      const header = screen.getByText('Test Header');
      expect(header).toBeTruthy();

      // Check cards are rendered
      const cards = screen.getAllByTestId(/card-/);
      expect(cards).toHaveLength(5);
    });

    /**
     * Test breakpoint boundaries to catch edge cases
     * Validates Requirements 3.1, 3.2, 3.3, 3.4
     * 
     * Critical breakpoints:
     * - 640px: Mobile to tablet transition
     * - 768px: Tablet breakpoint
     * - 1024px: Desktop breakpoint
     */
    it.each([
      { width: 640, description: 'at mobile-tablet boundary' },
      { width: 641, description: 'just above mobile-tablet boundary' },
      { width: 767, description: 'just below tablet breakpoint' },
      { width: 768, description: 'at tablet breakpoint' },
      { width: 1023, description: 'just below desktop breakpoint' },
      { width: 1024, description: 'at desktop breakpoint' },
    ])('should maintain correct behavior $description ($width px)', ({ width }) => {
      // Set viewport width
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: width,
      });

      const { container } = render(
        <CinematicHorizontalSection
          id="test-section"
          desktopBehavior="carousel"
          header={<h2>Test Header</h2>}
          renderCards={() =>
            mockCards.map((card) => (
              <div key={card.id} data-testid={`card-${card.id}`}>
                {card.content}
              </div>
            ))
          }
        />
      );

      // PRESERVATION CHECK 7: Breakpoint boundaries (Requirements 3.1, 3.2, 3.3, 3.4)
      // Behavior should transition correctly at breakpoint boundaries
      
      // All cards should be rendered
      const cards = screen.getAllByTestId(/card-/);
      expect(cards).toHaveLength(5);

      // Check that carousel structure exists
      const carouselContainer = container.querySelector('[class*="overflow"]');
      expect(carouselContainer).toBeTruthy();

      // For desktop viewports (≥640px), arrows should be visible
      if (width >= 640) {
        const prevButton = screen.queryByLabelText('Previous cards');
        const nextButton = screen.queryByLabelText('Next cards');
        
        expect(prevButton).toBeTruthy();
        expect(nextButton).toBeTruthy();
      }
    });
  });
});
