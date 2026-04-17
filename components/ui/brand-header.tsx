import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol, type IconSymbolName } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Props = {
  title: string;
  subtitle?: string;
  icon?: IconSymbolName;
  right?: ReactNode;
};

export function BrandHeader({ title, subtitle, icon, right }: Props) {
  const theme = useColorScheme() ?? 'light';
  const c = Colors[theme];

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <View style={[styles.header, { backgroundColor: c.surface, borderColor: c.border }]}>
        <View style={styles.row}>
          <View style={styles.left}>
            {icon ? (
              <View style={[styles.iconWrap, { backgroundColor: c.brandSoft }]}>
                <IconSymbol size={18} name={icon} color={c.brand} />
              </View>
            ) : null}

            <View style={styles.text}>
              <ThemedText style={[styles.title, { color: c.text }]}>{title}</ThemedText>
              {subtitle ? (
                <ThemedText style={[styles.subtitle, { color: c.mutedText }]}>{subtitle}</ThemedText>
              ) : null}
            </View>
          </View>

          {right ? <View style={styles.right}>{right}</View> : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
  },
  header: {
    marginHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  right: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});

