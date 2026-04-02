import { useState, useEffect, useMemo } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  type WhereFilterOp,
  type Query,
  type DocumentData,
  type QueryConstraint,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface FirestoreCondition {
  field: string;
  operator: WhereFilterOp;
  value: string | number | boolean;
}

/**
 * Real-time Firestore collection listener with optional filtering and ordering.
 * Serializes conditions/orderField to prevent infinite re-render loops.
 */
export function useFirestoreData<T extends { id: string }>(
  collectionName: string,
  conditions: FirestoreCondition[] = [],
  orderField?: string,
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stabilize conditions reference to prevent infinite effect loops
  const conditionsKey = useMemo(() => JSON.stringify(conditions), [conditions]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      const collRef = collection(db, collectionName);
      const parsedConditions: FirestoreCondition[] = JSON.parse(conditionsKey);

      const constraints: QueryConstraint[] = parsedConditions.map((c) =>
        where(c.field, c.operator, c.value),
      );

      if (orderField) {
        constraints.push(orderBy(orderField, 'asc'));
      }

      const q: Query<DocumentData> = constraints.length > 0
        ? query(collRef, ...constraints)
        : collRef;

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const results = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as T[];
          setData(results);
          setLoading(false);
        },
        (err) => {
          console.error(`Firestore error on ${collectionName}:`, err);
          setError(err.message);
          setLoading(false);
        },
      );

      return () => unsubscribe();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error(`Firestore setup error:`, message);
      setError(message);
      setLoading(false);
    }
  }, [collectionName, conditionsKey, orderField]);

  return { data, loading, error };
}
