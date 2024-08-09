# Generated by Django 4.2.6 on 2024-07-18 09:52

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('Departments', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='department',
            name='head',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='headed_department', to=settings.AUTH_USER_MODEL),
        ),
    ]
